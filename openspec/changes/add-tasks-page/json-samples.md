The tasks page will provide a list of tasks. Tasks may be pending or completed, if a task is pending they will be allowed to create a spend for that tasks.

Tasks can be obtained from the API using the `GET ${API_URL}/tasks` endpoint. This endpoint will return tasks object with this attributes :

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

Task types may be `MANUAL` or `AUTOMATIC` :

- `AUTOMATIC` : automatic tasks generates spends automatically
- `MANUAL`: manual tasks needs user interaction to generate spends (for example, completing the task on Google Tasks).

For `MANUAL` tasks, if the `spend_id` attribute is non-null it means the task was completed (spend was generated). Note that the corresponding Google Task may or may not be completed yet.Users will be allowed to create spends from task using the corresponding information, for example, with the above JSON the new spend will be created with :

- Account number: 7
- Category: 3
- Subcategory: 12
- Group: 1
- Amount: 1200.50
- Description: Monthly apartment rent
