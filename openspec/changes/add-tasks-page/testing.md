<!-- Not an OpenSpec artifact. This is a manual QA checklist for you to run and check off yourself once the tasks in tasks.md are implemented — the implementing agent cannot drive a browser or inspect a running dev server, so these checks are not self-verifiable and are tracked here instead. -->

# Manual QA checklist — add-tasks-page

Run `npm run dev`, log in, and work through these against the real API.

## API mapping (tasks 1.3, 1.4)

- [ ] `getTasks()` — log the result once in the browser console and confirm every field maps correctly against a real `/tasks` response (id, isGoogleTaskCompleted, taskConfig.*, spendId, createdDate, updatedDate, finishedDate).
- [ ] `completeGoogleTask(taskId)` — call it against a real incomplete task and confirm the response reflects `isGoogleTaskCompleted: true`.

## Spend-creation prefill extension (tasks 2.1, 2.2)

- [ ] Open `/spends/new` with no query params — confirm the form still starts with `value` empty/0 and `description` empty (existing behavior unaffected).
- [ ] Open `/spends/new?categoryId=<id>&accountId=<id>&value=42.5&description=test` — confirm all five fields pre-fill correctly.

## Task listing page (tasks 3.2–3.4)

- [ ] Navigate to `/tasks/list` while logged in — page loads without redirect or 404.
- [ ] All 12 columns render in the order from design.md Decision 6, with correctly formatted values.
- [ ] "Completed" column shows Yes/No matching `task-listing/spec.md`'s scenarios for a mix of `MANUAL`/`AUTOMATIC` and null/non-null `spendId` tasks.

## Task filtering (tasks 4.2, 4.3)

- [ ] Filters modal opens from the three-dots icon and shows type/account/category/subcategory/group multi-selects plus a start/end date range picker.
- [ ] Filtering by type shows only matching tasks.
- [ ] Filtering by subcategory/group still includes tasks whose `task_config` has no subcategory/group (per `task-filtering/spec.md`).
- [ ] Setting a date range excludes tasks created outside it.

## Create spend from task (task 5)

- [ ] Clicking "Create spend" on a pending `MANUAL` task opens `NewSpend` pre-filled with that task's account/category/subcategory/group/value/description.
- [ ] Submitting without editing creates a spend matching the task's `task_config`.
- [ ] Editing a pre-filled value before submitting creates the spend with the edited value.
- [ ] `AUTOMATIC` tasks and completed `MANUAL` tasks (`spendId` non-null) never show the "Create spend" action — they show the "already created" text instead (for completed ones).

## Google Task completion (task 6)

- [ ] `AUTOMATIC` tasks always show `-` in the Google Task column, regardless of `createGoogleTask`/`isGoogleTaskCompleted`.
- [ ] `MANUAL` task with `createGoogleTask: false` shows `-`.
- [ ] `MANUAL` task with `createGoogleTask: true` and already completed shows `Completed` text, no button.
- [ ] `MANUAL` task with `createGoogleTask: true` and not completed shows the completion button; clicking it marks it completed and the column updates to `Completed`.

## Final pass (task 7.1 follow-up)

- [ ] Walk through every scenario in `specs/task-listing/spec.md`, `specs/task-creation/spec.md`, `specs/task-filtering/spec.md`, and `specs/task-google-task-completion/spec.md` end-to-end against the running app.
