# Spec Delta

## Purpose

Lets users mark a manual task's linked Google Task as completed directly from the tasks page, independently of the task's own spend-based completion status.

## ADDED Requirements

### Requirement: Complete a manual task's linked Google Task
For a `MANUAL` task whose `task_config.create_google_task` is `true` and whose `is_google_task_completed` is `false`, the system SHALL allow the user to mark the linked Google Task as completed via `PATCH ${API_URL}/tasks/{id}`. For an `AUTOMATIC` task, the system SHALL always display no Google Task status (`-`) and SHALL NOT offer this action, regardless of `task_config.create_google_task` or `is_google_task_completed`. The system SHALL also NOT offer this action for `MANUAL` tasks without a linked Google Task (`task_config.create_google_task` is `false`), or whose linked Google Task is already completed (`is_google_task_completed` is `true`).

#### Scenario: Completing an incomplete linked Google Task
- **WHEN** the user marks as completed a `MANUAL` task's linked Google Task that is not yet completed
- **THEN** the system marks the linked Google Task as completed and updates `is_google_task_completed` to `true`

#### Scenario: Automatic task always shows no Google Task status
- **WHEN** the user views an `AUTOMATIC` task
- **THEN** the system displays `-` for that task's Google Task status and does not offer an action to complete a linked Google Task for that task

#### Scenario: Task without a linked Google Task offers no completion action
- **WHEN** the user views a task whose `task_config.create_google_task` is `false`
- **THEN** the system does not offer an action to complete a linked Google Task for that task

#### Scenario: Already completed Google Task offers no further action
- **WHEN** the user views a task whose `is_google_task_completed` is already `true`
- **THEN** the system does not offer an action to complete a linked Google Task for that task
