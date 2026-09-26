# Spec Delta

## Purpose

Lets users filter the tasks list by type, creation date range, account, category, subcategory, and group so they can quickly find relevant tasks.

## ADDED Requirements

### Requirement: Filter tasks by type
The system SHALL allow the user to filter the tasks list by task type, selecting one or more of `MANUAL` and `AUTOMATIC`.

#### Scenario: Filtering by task type
- **WHEN** the user selects one or more task types in the filter
- **THEN** the system displays only tasks whose type matches one of the selected types

### Requirement: Filter tasks by creation date range
The system SHALL allow the user to filter the tasks list by a creation date range, using a start date and an end date.

#### Scenario: Filtering by creation date range
- **WHEN** the user sets a start date and/or an end date in the filter
- **THEN** the system displays only tasks whose creation date falls within the selected range

### Requirement: Filter tasks by account, category, subcategory, and group
The system SHALL allow the user to filter the tasks list by one or more accounts, categories, subcategories, and groups, each selected from the values present in the tasks' `task_config`, following the same multi-select filtering pattern used for spends. A task whose `task_config` does not define a subcategory or group SHALL always match the subcategory/group filter, regardless of which values are selected — consistent with how spends without a subcategory/group are always included.

#### Scenario: Filtering by account or category
- **WHEN** the user selects one or more accounts or categories in the filter
- **THEN** the system displays only tasks whose `task_config` account or category matches one of the selected values

#### Scenario: Subcategory or group filter does not exclude tasks with no value
- **WHEN** the user selects one or more subcategories or groups in the filter, and a task's `task_config` does not define that field
- **THEN** the system still includes that task in the filtered results
