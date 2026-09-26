# Proposal

## Why

Tasks (obtained from the API) represent spends that are pending or already generated, but there is currently no page to view them or to create the corresponding spend from a pending (`MANUAL`) task's data. Users need a tasks page to see pending/completed tasks and to create a spend from a pending `MANUAL` task without manually re-entering its data.

## What Changes

- Add a new "Tasks" page listing tasks fetched from `GET ${API_URL}/tasks`.
- Display each task as pending or completed:
  - `MANUAL` task: completed when `spend_id` is non-null (independent of whether the corresponding Google Task is completed).
  - `AUTOMATIC` task: spend is generated automatically by the system, not by user action.
- For pending `MANUAL` tasks, allow the user to create a spend using the task's `task_config` data (account, category, subcategory, group, spend value, spend description). The created spend may or may not match the task's suggested values exactly.

## Capabilities

### New Capabilities
- `tasks`: Fetching and displaying the list of tasks (pending/completed), and creating a spend from a pending `MANUAL` task using its `task_config` data.

### Modified Capabilities
- None — no existing capability's requirements change.

## Impact

- New frontend route/page for tasks.
- New API integration: `GET ${API_URL}/tasks`.
- Reuses existing spend-creation flow/API (account, category, subcategory, group, amount, description) as the target of the "create spend from task" action.
