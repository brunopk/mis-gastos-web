## Context

The project currently uses `src/types.d.ts` as an ambient declaration file, which makes all types (`Api.*`, `UI.*`, `ModalBaseProps`, `DayjsDate`) globally available without any import. This works but hides dependencies — it's impossible to tell from a file's imports what types it relies on. The pattern is appropriate for library authors augmenting global scope, not for application code.

## Goals / Non-Goals

**Goals:**
- Delete `types.d.ts` and replace it with explicit exports/imports
- Create `src/api/mis-gastos/types.ts` as the home for API domain types
- Co-locate component prop types with their component files
- Co-locate hook param types with their hook files
- No runtime behavior changes

**Non-Goals:**
- Renaming or restructuring types (shapes stay the same)
- Fixing the duplicate action interfaces inside hooks (`useSpendCreation`, `useIncomeCreation`) — that's a separate concern
- Adding new types or expanding the type surface

## Decisions

### 1. New `src/api/mis-gastos/types.ts` for API types

API domain types (`ListItem`, `Subcategory`, `Group`, `Spend`, `Income`, `AuthCallbackRequest`, `AutocompleteOptions`, `CategoriesMap`, `SubcategoriesMap`) are consumed across many files (`api.ts`, `utils.ts`, hooks, components). Putting them in a dedicated `types.ts` next to `api.ts` keeps them close to the layer they describe without coupling to any single consumer.

### 2. Keep the `Api` prefix on API domain types, drop `UI` prefixes

Types from the `Api` namespace keep their prefix in the new `src/api/mis-gastos/types.ts` (e.g. `ApiListItem`, `ApiSpend`, `ApiIncome`). Generic names like `ListItem` or `Spend` are likely to collide with local types in consumer files — `useSpendFilters.ts` already has its own `ListItem` with a different shape. The prefix makes the origin clear and prevents conflicts without requiring per-file aliasing.

`UI.*` types move to their owning component files with plain names (e.g. `AutocompleteProps`, `PageProps`) since they're scoped to a single file and collisions are unlikely.

### 3. `DayjsDate` moves to `src/utils.ts`

It's a type alias for the return of `dayjs()` and is used wherever dates appear. `utils.ts` already exports date-related helpers (`toDate`, `buildDateFormatter`), making it the natural home.

### 4. Migrate file by file, starting from leaves

Start with self-contained moves that don't require other files to change first — for example, moving `UI.AutocompleteProps` into `Autocomplete.tsx` only touches that one file. Then create `src/api/mis-gastos/types.ts` and finally update every consumer (any file that currently uses `Api.*` or `UI.*` types from the global scope) to import explicitly.

"Consumers" are files that use the types but don't define them — e.g. `useSpendCreation.ts` uses `Api.Spend` and `Api.ListItem` without importing anything today. After the migration, those files must add `import type { ApiSpend, ApiListItem } from '../api/mis-gastos/types'` or the build breaks.

## Risks / Trade-offs

- **Large diff, low risk**: Many files touched but changes are mechanical (add import, remove namespace prefix). → Mitigation: migrate one file at a time, verify TypeScript compiles after each.