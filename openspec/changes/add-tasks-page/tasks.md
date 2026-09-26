# Tasks

## 1. API layer: `ApiTask` types and `/tasks` requests

- [ ] 1.1 Add `ApiTaskType`, `ApiTaskConfig`, and `ApiTask` to `src/api/mis-gastos/types.ts` per design.md Decision 2, and verify `npm run build` type-checks with no errors referencing these new types.
- [ ] 1.2 Add a `patch(url, json)` helper to `src/api/mis-gastos/api.ts` (mirroring the existing `get`/`post` helpers: `fetch` with `credentials: 'include'`, `Content-Type: application/json`, routed through `handleApiErrors`), and verify `npm run build` type-checks.
- [ ] 1.3 Add `getTasks(): Promise<ApiTask[]>` to `api.ts`, mapping the raw snake_case `/tasks` response (per design.md Decision 2's sample payload) to `ApiTask[]`, following the same mapping style as `getSpends`/`getIncomes`, and verify `npm run build` type-checks and the mapping matches the sample payload field-for-field on manual code review. (Real-API confirmation is tracked in testing.md.)
- [ ] 1.4 Add `completeGoogleTask(taskId: number): Promise<ApiTask>` to `api.ts`, calling `patch(...)` against `PATCH ${API_URL}/tasks/{id}` with body `{ is_google_task_completed: true }`, and verify `npm run build` type-checks. (Real-API confirmation is tracked in testing.md.)

## 2. Extend spend-creation prefill for "create spend from task"

- [ ] 2.1 Add `defaultValue: number | null` and `defaultDescription: string | null` to `UseSpendCreationParams` in `src/hooks/useSpendCreation.ts`, and use them in the `INITIALIZE` reducer case in place of the hardcoded `value: 0, description: null`, and verify `npm run build` type-checks and that omitting both params preserves the existing `value: 0, description: null` defaults on manual code review. (Browser confirmation is tracked in testing.md.)
- [ ] 2.2 Update `buildUseSpendCreationHookParams` in `src/components/pages/spends/sub-pages/new-spend/NewSpend.tsx` to parse `value` and `description` from `URLSearchParams` the same way it parses the id params, and verify `npm run build` type-checks. (Browser confirmation is tracked in testing.md.)

## 3. Task listing page

- [ ] 3.1 Add `PATHS.TASKS = { INDEX: '/tasks/', LIST: 'list' }` to `src/constants.ts`, and verify `npm run build` type-checks.
- [ ] 3.2 Create `src/components/pages/tasks/sub-pages/task-list/TaskList.tsx` mirroring `SpendList.tsx`'s structure: `Page` + `Table`, its own `useQuery({ queryKey: ['tasks'], queryFn: Api.getTasks, staleTime: Infinity, gcTime: Infinity, retry: 2 })`, and a colocated `isTaskCompleted(task): boolean` helper (design.md Decision 2) used to build a "Completed" (Yes/No) column, and verify `npm run build` type-checks. (Rendering confirmation is tracked in testing.md.)
- [ ] 3.3 Implement `buildColumnList` in `TaskList.tsx` with the 12-column order from design.md Decision 6 (ID, Date, Task name, Category, Subcategory, Group, Account, Description, Amount, Completed, Google Task, Spend), leaving the Google Task and Spend columns as static placeholders for now (wired up in tasks 5 and 6), and verify `npm run build` type-checks. (Rendering confirmation is tracked in testing.md.)
- [ ] 3.4 Register the `TaskList` route in `src/components/Routes.tsx` under a new `PrivateRoute` block for `PATHS.TASKS` (mirroring the `SPENDS`/`INCOME` blocks), and verify `npm run build` type-checks. (Navigation confirmation is tracked in testing.md.)

## 4. Task filtering

- [ ] 4.1 Create `src/hooks/useTaskFilters.ts` mirroring `useSpendFilters.ts`'s reducer/selection-list shape, adding task type (`MANUAL`/`AUTOMATIC`) as a new multi-select alongside the existing account/category/subcategory/group lists, and verify `npm run build` type-checks.
- [ ] 4.2 Create `src/components/pages/tasks/sub-pages/task-list/TaskFilters.tsx` mirroring `SpendFilters.tsx`'s modal (checkbox multi-selects for type/account/category/subcategory/group, plus a start/end `DatePicker` pair for creation date), and verify `npm run build` type-checks. (Modal-interaction confirmation is tracked in testing.md.)
- [ ] 4.3 Implement the task filter predicate in `TaskList.tsx`'s row-building function per design.md Decision 4 (type match, date-range match, and the "undefined subcategory/group always matches" rule reused from `SpendList.tsx`), and verify `npm run build` type-checks and that the predicate logic matches the rule on manual code review. (Behavioral confirmation is tracked in testing.md.)

## 5. Create spend from a pending manual task

- [ ] 5.1 Add a "Create spend" row action to `TaskList.tsx`'s Spend column, shown only when `task.taskConfig.taskType == 'MANUAL' && task.spendId == null`, navigating to `PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW` with a query string built from `task.taskConfig` (per design.md Decision 3), and verify `npm run build` type-checks. (Navigation/prefill confirmation is tracked in testing.md.)
- [ ] 5.2 For tasks that already have a non-null `spendId`, render text in the Spend column indicating the spend was already created (instead of the button), and verify `npm run build` type-checks.
- [ ] 5.3 Read through the implementation of tasks 5.1/5.2 against every scenario in `specs/task-creation/spec.md` and confirm on code review that each condition (`MANUAL` + pending, `AUTOMATIC`, completed `MANUAL`) is handled. (End-to-end confirmation is tracked in testing.md.)

## 6. Complete a manual task's linked Google Task

- [ ] 6.1 Wire `Api.completeGoogleTask` into a `useMutation` in `TaskList.tsx` (`onSuccess` invalidates the `['tasks']` query, `onError` shows a notification, mirroring `NewSpend.tsx`'s `useMutation` pattern), and verify `npm run build` type-checks.
- [ ] 6.2 Render the Google Task column per design.md Decision 5's three-state logic (`-` for `AUTOMATIC` tasks and for `MANUAL` tasks without a linked Google Task; `Completed` text when `isGoogleTaskCompleted`; a completion button otherwise), and verify `npm run build` type-checks and that the four flag combinations from Decision 5 map to the right state on manual code review. (Visual confirmation is tracked in testing.md.)
- [ ] 6.3 Read through the implementation of tasks 6.1/6.2 against every scenario in `specs/task-google-task-completion/spec.md` and confirm on code review that each condition is handled. (End-to-end confirmation is tracked in testing.md.)

## 7. Final integration pass

- [ ] 7.1 Run `npm run lint` and `npm run build` against the full change and fix any reported issues.
