# Proposal

## Why

Tasks (obtained from the API) represent spends that are pending or already generated, but there is currently no page to view them or to create the corresponding spend from a pending (`MANUAL`) task's data. Users need a tasks page to see pending/completed tasks and to create a spend from a pending `MANUAL` task without manually re-entering its data.

## What Changes

- Add a new "Tasks" page listing tasks fetched from `GET ${API_URL}/tasks`.
- Display each task as pending or completed:
  - `MANUAL` task: completed when `spend_id` is non-null (independent of whether the corresponding Google Task is completed).
  - `AUTOMATIC` task: spend is generated automatically by the system, not by user action.
- For pending `MANUAL` tasks, allow the user to create a spend using the task's `task_config` data (account, category, subcategory, group, spend value, spend description).
- For `MANUAL` tasks that have a linked Google Task (`task_config.create_google_task` is `true`), allow the user to mark that Google Task as completed directly from the tasks page, independently of creating the task's spend. `AUTOMATIC` tasks never offer this action, regardless of `create_google_task`.

## Capabilities

### New Capabilities

- `task-listing`: Fetching and displaying the list of tasks (pending/completed)
- `task-creation`: Creating a spend from a pending `MANUAL` task using its `task_config` data.
- `task-filtering`: Filtering tasks by :
  - Type: `MANUAL` or `AUTOMATIC`)
  - Dates: creation date
  - Account: extracted from `task_config`
  - Category: extracted from `task_config`
  - Subcategory: extracted from `task_config` (it may be not defined)
  - Group: extracted from `task_config` (it may be not defined)
- `task-google-task-completion`: Marking a `MANUAL` task's linked Google Task as completed, for tasks where `task_config.create_google_task` is `true` and `is_google_task_completed` is `false`.

### Modified Capabilities

- None — no existing capability's requirements change.

## Impact

- New frontend route/page for tasks.
- New API integration: `GET ${API_URL}/tasks` and `PATCH ${API_URL}/tasks/{id}` (marks the linked Google Task as completed).
- Reuses existing spend-creation flow/API (account, category, subcategory, group, amount, description) as the target of the "create spend from task" action.
