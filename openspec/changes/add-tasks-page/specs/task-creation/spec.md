# Spec Delta

## Purpose

Lets users create a spend directly from a pending manual task's data, without re-entering it by hand.

## ADDED Requirements

### Requirement: Create a spend from a pending manual task
For a pending `MANUAL` task (`spend_id` is `null`), the system SHALL allow the user to create a spend pre-filled from the task's `task_config` (account, category, subcategory, group, spend value, spend description), and SHALL allow the user to modify these values before the spend is created. The system SHALL NOT offer this action for `AUTOMATIC` tasks or for `MANUAL` tasks that already have a non-null `spend_id`.

#### Scenario: Creating a spend from a pending manual task with default values
- **WHEN** the user chooses to create a spend from a pending `MANUAL` task without changing any values
- **THEN** the system creates a spend using the task's `task_config` account, category, subcategory, group, spend value, and spend description

#### Scenario: Automatic task offers no manual spend creation
- **WHEN** the user views an `AUTOMATIC` task
- **THEN** the system does not offer an action to manually create a spend for that task

#### Scenario: Completed manual task offers no spend creation
- **WHEN** the user views a `MANUAL` task whose `spend_id` is non-null
- **THEN** the system does not offer an action to create another spend for that task
