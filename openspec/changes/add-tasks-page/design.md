# Design

## Context

The app already has an equivalent list+filter+create flow for spends (`src/components/pages/spends/sub-pages/spend-list/SpendList.tsx` + `SpendFilters.tsx` + `hooks/useSpendFilters.ts`) and a spend creation form (`src/components/pages/spends/sub-pages/new-spend/NewSpend.tsx` + `hooks/useSpendCreation.ts`) that already supports pre-filling category/subcategory/group/account from `URLSearchParams` (see `buildUseSpendCreationHookParams` in `NewSpend.tsx`).

Routes are registered in `src/components/Routes.tsx` under a `PrivateRoute`, with rarely-changing dropdown-option lists (categories, subcategories, groups, accounts, income types) prefetched once by a shared loader (`MisGastosUtils.loaderFunctionBuilder`) and cached indefinitely

Per-user-action record lists (spends) are fetched independently by each page via its own `useQuery`. 

There is no `ApiTask` type or `/tasks` API integration yet — this change introduces both. See proposal.md - Why / What Changes for motivation.

## Goals / Non-Goals

**Goals:**
- Reuse the spends list/filter/create architecture (component shape, hook shape, styled components, filtering pattern) rather than inventing a new one.
- Keep the new API surface (`getTasks`, `ApiTask`) isolated to `src/api/mis-gastos/` so backend field-name assumptions are easy to correct in one place.
- Extend the existing spend-creation prefill mechanism (query params) instead of forking a second spend-creation flow.

**Non-Goals:**
- Editing or deleting tasks, or any other write to the linked Google Task besides marking it completed (e.g. no editing its title, due date, or un-completing it).
- Server-side pagination or filtering (spends already do this filtering client-side; tasks follow the same precedent).
- Real-time/live updates of task status.

## Decisions

### 1. New capability → new files, mirroring the spends structure
- `src/components/pages/tasks/sub-pages/task-list/TaskList.tsx` (mirrors `SpendList.tsx`): `Page` + `Table` + filters modal, using its own `useQuery({ queryKey: ['tasks'], queryFn: Api.getTasks, staleTime: Infinity, gcTime: Infinity, retry: 2 })`, same as spends.
- `src/components/pages/tasks/sub-pages/task-list/TaskFilters.tsx` + `src/hooks/useTaskFilters.ts` (mirrors `SpendFilters.tsx` / `useSpendFilters.ts`): same multi-select checkbox pattern for account/category/subcategory/group, plus a new multi-select for task type (`MANUAL`/`AUTOMATIC`), plus the existing start/end `DatePicker` pair applied to the task's creation date instead of the spend's date.
- New route: `PATHS.TASKS = { INDEX: '/tasks/', LIST: 'list' }` in `constants.ts`, registered in `Routes.tsx` under its own `PrivateRoute` block (same pattern as `SPENDS`/`INCOME`), pointing at `TaskList`.

**Alternative considered**: a single combined "Tasks" capability folder instead of separating list/filter/create — rejected because the proposal already splits these into three independent capabilities (`task-listing`, `task-filtering`, `task-creation`) with their own specs; keeping the file/hook boundaries aligned with that split keeps traceability from spec → code straightforward.

### 2. `ApiTask` shape and mapping stay isolated in the API layer
The actual `/tasks` payload (per the real API response) nests `task_type`, `task_name`, and `create_google_task` inside `task_config`, and carries `is_google_task_completed` and `finished_at` at the top level alongside `spend_id`:
```json
{
  "id": 101,
  "is_google_task_completed": true,
  "task_config": {
    "id": 42,
    "task_name": "Monthly Rent Reminder",
    "task_type": "MANUAL",
    "create_google_task": true,
    "category_id": 3,
    "subcategory_id": 12,
    "group_id": 1,
    "account_id": 7,
    "spend_value": 1200.50,
    "spend_description": "Monthly apartment rent"
  },
  "spend_id": 12,
  "created_at": "2026-09-20T09:15:00Z",
  "updated_at": "2026-09-25T14:32:05Z",
  "finished_at": "2026-09-25T14:32:00Z"
}
```

Add to `src/api/mis-gastos/types.ts`:

```ts
export type ApiTaskType = 'MANUAL' | 'AUTOMATIC'

export interface ApiTaskConfig {
  id: number
  taskName: string
  taskType: ApiTaskType
  createGoogleTask: boolean
  categoryId: number
  subcategoryId: number | null
  groupId: number | null
  accountId: number
  spendValue: number
  spendDescription?: string
}

export interface ApiTask {
  id: number
  isGoogleTaskCompleted: boolean
  taskConfig: ApiTaskConfig
  spendId: number | null
  createdDate: DayjsDate
  updatedDate: DayjsDate
  finishedDate: DayjsDate | null
}
```

Add `getTasks(): Promise<ApiTask[]>` to `src/api/mis-gastos/api.ts`, following the same `get(...)` + snake_case→camelCase mapping pattern already used by `getSpends`/`getIncomes`.

Completion status is derived, not stored: a helper `isTaskCompleted(task: ApiTask): boolean` (colocated with `TaskList.tsx`, same level as `buildTableRows`/`buildColumnList` in `SpendList.tsx`) returns `task.taskConfig.taskType == 'AUTOMATIC' || task.spendId != null`, per `specs/task-listing/spec.md`. `isGoogleTaskCompleted` is unrelated to this helper — it only drives the separate "Google Task" column and the completion action (Decision 5), never the task's own pending/completed status.

**Alternative considered**: treating `is_google_task_completed` as an input to `isTaskCompleted`. Rejected — the spec is explicit that a `MANUAL` task's completion depends only on `spend_id`, regardless of the linked Google Task's state.

### 3. Extend the existing query-param prefill mechanism for "create spend from task"
`NewSpend.tsx` already reads `categoryId`/`subcategoryId`/`groupId`/`accountId` from `URLSearchParams` via `buildUseSpendCreationHookParams` and passes them into `useSpendCreation` as defaults. This change extends that mechanism with two more optional params, `value` and `description`, so a task's `task_config` values can prefill the whole form:
- `UseSpendCreationParams` (`hooks/useSpendCreation.ts`) gains `defaultValue: number | null` and `defaultDescription: string | null`.
- The `INITIALIZE` reducer case uses them instead of hardcoding `value: 0, description: null` when present.
- `buildUseSpendCreationHookParams` (`NewSpend.tsx`) parses `value` and `description` from the search string the same way it already parses the id params.
- The "Create spend" row action in `TaskList.tsx` (rendered only when `task.taskConfig.taskType == 'MANUAL' && task.spendId == null`, per `specs/task-creation/spec.md`) navigates to `PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW` with a query string built from `task.taskConfig` (`spendValue` → `value`, `spendDescription` → `description`), mirroring how `SpendList.tsx`'s existing "ADD REIMBURSEMENT" button navigates to `PATHS.INCOME.INDEX + PATHS.INCOME.NEW`.

**Alternative considered**: passing the task via `navigate(..., { state: { task } })` instead of query params (as the income flow does with `{ state: { spend } }`). Rejected for consistency: `NewSpend` already has a working, tested query-param prefill path for the exact four id fields this feature also needs; adding two params to that path is smaller and more consistent than introducing a second, state-based prefill path into the same component.

### 4. Filtering logic follows the spends precedent exactly, including the "undefined never excludes" rule
`SpendList.tsx`'s `buildTableRows` already implements "a spend with no subcategory/group always matches the subcategory/group filter" via `(!filters.groupIds || filters.groupIds.length == 0 || !spend.groupId || filters.groupIds.includes(spend.groupId))`. `TaskList.tsx`'s equivalent filter function reuses the identical `!task.taskConfig.groupId || ...` clause, plus a new clause for the type multi-select (matching against `task.taskConfig.taskType`) and a date-range clause (`filters.startDate.isBefore(task.createdDate) && filters.finalDate.isAfter(task.createdDate)`) reusing the same date comparison already used for spends.

### 5. Completing the linked Google Task is a scoped PATCH, `MANUAL`-only
Add `completeGoogleTask(taskId: number): Promise<ApiTask>` to `src/api/mis-gastos/api.ts`, calling a new `patch(url, json)` helper (added alongside the existing `get`/`post` helpers, same `fetch` + `credentials: 'include'` + `handleApiErrors` shape) that sends `PATCH ${API_URL}/tasks/{id}` with body `{ is_google_task_completed: true }` and maps the response the same way `getTasks` does.

The action is exposed as a row button in `TaskList.tsx`, wired to a `useMutation({ mutationFn: Api.completeGoogleTask, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }) })` (same success/error notification pattern as `NewSpend.tsx`'s `useMutation`). Per `specs/task-google-task-completion/spec.md`, the "Google Task" column renders one of three states, derived client-side from existing fields (no new field needed):
- `task.taskConfig.taskType == 'AUTOMATIC'` → always `-`, regardless of `createGoogleTask`/`isGoogleTaskCompleted`
- `taskType == 'MANUAL' && !task.taskConfig.createGoogleTask` → `-`
- `taskType == 'MANUAL' && createGoogleTask && isGoogleTaskCompleted` → `Completed`
- `taskType == 'MANUAL' && createGoogleTask && !isGoogleTaskCompleted` → the completion button

**Alternative considered**: allowing the completion action for `AUTOMATIC` tasks too. Rejected per explicit product decision — `AUTOMATIC` tasks always display `-` for Google Task status, with no action offered, regardless of the underlying flags.

**Alternative considered (endpoint)**: a dedicated `/tasks/{id}/complete-google-task` action endpoint instead of a generic `PATCH /tasks/{id}`. Not chosen here since the user specified the generic-PATCH shape; noted only so a future contract mismatch is easy to trace back to this decision.

### 6. Table column order
`TaskList.tsx`'s `buildColumnList` mirrors `SpendList.tsx`'s ordering (identifying fields → classification → description/value → status → actions), extended with task-specific columns:

1. ID
2. Date (`createdDate`)
3. Task name (`taskConfig.taskName`)
4. Category
5. Subcategory
6. Group
7. Account
8. Description (`taskConfig.spendDescription`)
9. Amount (`taskConfig.spendValue`)
10. Completed (Yes/No — from the `isTaskCompleted` helper in Decision 2)
11. Google Task (Decision 5's three-state column)
12. Spend (the "Create spend" button from Decision 3, or text indicating the spend already exists)

## Risks / Trade-offs

- [The `/tasks` payload shown in Decision 2 was provided directly by the user for this design, not confirmed against live API docs/responses] → Mitigation: mapping is isolated to `getTasks`/`completeGoogleTask` in `api.ts`, so a mismatch only requires editing those two functions, not the components/hooks built against `ApiTask`.
- [Client-side filtering means the full task list is always fetched] → Mitigation: this matches the existing, accepted precedent for spends; revisit only if task volume becomes a real performance problem.
- [Extending `useSpendCreation`'s `INITIALIZE` defaults touches a shared hook used by the existing spend-creation page] → Mitigation: the two new params are optional and additive (`null`/`undefined` preserves today's `value: 0, description: null` behavior), so existing spend creation is unaffected.
- [`spend_value` in the sample payload carries cents (`1200.50`), but `NewSpend.tsx`'s value field currently does `parseInt(event.target.value)` on every edit, truncating decimals] → Mitigation: pre-filled values display correctly on load (the reducer stores the raw prefilled number), but if the user edits the amount field afterward it truncates to an integer today, regardless of this change; fixing that is out of scope here since it's a pre-existing limitation of `NewSpend`, not something introduced by task creation.
- [A generic `PATCH /tasks/{id}` accepting `{ is_google_task_completed: true }` has no server-side guarantee it will reject setting it back to `false` or setting it on an `AUTOMATIC` task] → Mitigation: the frontend only ever sends `true` and only exposes the button under the conditions in Decision 5; enforcing the full constraint server-side is a backend concern outside this frontend change.
