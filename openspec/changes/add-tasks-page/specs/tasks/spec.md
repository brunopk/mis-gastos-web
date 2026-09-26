# Spec Delta

## Purpose

Lets users view their tasks (pending or completed) and create a spend directly from a pending manual task's data, without re-entering it by hand.

## ADDED Requirements

### Requirement: List tasks
The system SHALL fetch tasks from `GET ${API_URL}/tasks` and display them on a tasks page, each shown as pending or completed.

#### Scenario: Viewing the tasks page
- **WHEN** the user opens the tasks page
- **THEN** the system fetches tasks from `GET ${API_URL}/tasks` and displays each task with its pending/completed status

### Requirement: Determine task completion status
For a `MANUAL` task, the system SHALL treat the task as completed only when its `spend_id` is non-null, regardless of the completion state of its linked Google Task. For an `AUTOMATIC` task, the system SHALL treat the task as completed once its spend has been generated, since `AUTOMATIC` tasks generate spends without user action.

#### Scenario: Manual task with a linked Google Task not yet completed
- **WHEN** a `MANUAL` task has `spend_id` set to a non-null value and its linked Google Task is not completed
- **THEN** the system displays the task as completed

#### Scenario: Manual task pending
- **WHEN** a `MANUAL` task has `spend_id` equal to `null`
- **THEN** the system displays the task as pending, regardless of the linked Google Task's completion state

### Requirement: Create a spend from a pending manual task
For a pending `MANUAL` task (`spend_id` is `null`), the system SHALL allow the user to create a spend pre-filled from the task's `task_config` (account, category, subcategory, group, spend value, spend description), and SHALL allow the user to modify these values before the spend is created. The system SHALL NOT offer this action for `AUTOMATIC` tasks or for `MANUAL` tasks that already have a non-null `spend_id`.

#### Scenario: Creating a spend from a pending manual task with default values
- **WHEN** the user chooses to create a spend from a pending `MANUAL` task without changing any values
- **THEN** the system creates a spend using the task's `task_config` account, category, subcategory, group, spend value, and spend description

#### Scenario: Creating a spend from a pending manual task with edited values
- **WHEN** the user changes one or more pre-filled values before confirming
- **THEN** the system creates the spend using the edited values instead of the task's original `task_config` values

#### Scenario: Automatic task offers no manual spend creation
- **WHEN** the user views an `AUTOMATIC` task
- **THEN** the system does not offer an action to manually create a spend for that task

#### Scenario: Completed manual task offers no spend creation
- **WHEN** the user views a `MANUAL` task whose `spend_id` is non-null
- **THEN** the system does not offer an action to create another spend for that task
