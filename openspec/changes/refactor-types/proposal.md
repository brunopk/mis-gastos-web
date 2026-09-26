## Why

`types.d.ts` is an ambient declaration file — the right tool for libraries and global shims, not application code. It makes types globally available without imports, hiding dependencies. The fix is to delete it and co-locate each type with the file that owns it, using explicit exports and imports instead. For example, `UI.AutocompleteProps` is the props interface for `Autocomplete.tsx` — it should be defined and exported there, not in a global file.

## What Changes

- Delete `src/types.d.ts`
- Move API domain types (`ListItem`, `Subcategory`, `Group`, `Spend`, `Income`, `AuthCallbackRequest`, `AutocompleteOptions`, `CategoriesMap`, `SubcategoriesMap`) to `src/api/mis-gastos/types.ts` and export them explicitly
- Move component prop types to their owning component files:
  - `UI.AutocompleteProps` → `src/components/Autocomplete.tsx`
  - `UI.SpendFilterProps` → `src/components/pages/spends/sub-pages/spend-list/SpendFilters.tsx`
  - `UI.PageProps` → `src/components/Page.tsx`
  - `ModalBaseProps` → `src/components/modal/ModalBase.tsx`
- Move table types (`UI.Table.*`) to `src/components/Table.tsx`
- Move hook param types (`UI.Hooks.UseSpendCreation.Params`, etc.) to their respective hook files
- Move `DayjsDate` type alias to `src/utils.ts` and export it
- Update all import sites to use explicit imports instead of global namespace access

## Capabilities

### New Capabilities
- `type-organization`: Convention that types must be co-located with the file that owns them, exported explicitly, and imported where needed — no ambient globals

### Modified Capabilities
<!-- None — this is a pure internal refactor with no behavior or API changes -->

## Impact

- `src/types.d.ts` — deleted
- `src/api/mis-gastos/types.ts` — new file with all API domain types
- `src/api/mis-gastos/api.ts`, `src/api/mis-gastos/utils.ts` — updated imports
- `src/components/Autocomplete.tsx`, `Page.tsx`, `modal/ModalBase.tsx`, `Table.tsx` — each gains its own prop/type exports
- `src/components/pages/spends/sub-pages/spend-list/SpendFilters.tsx` — gains prop type export
- `src/hooks/useSpendCreation.ts`, `useIncomeCreation.ts`, `useSpendFilters.ts` — updated imports
- `src/context/UserContext.tsx`, `src/utils.ts` — minor updates
- No runtime behavior changes
