## 1. Prepare shared utilities

- [x] 1.1 Export `Formatter` type from `src/utils.ts`
- [x] 1.2 Export `DayjsDate` type alias from `src/utils.ts`

## 2. Create API types module

- [x] 2.1 Create `src/api/mis-gastos/types.ts` with all API domain types using `Api` prefix (`ApiListItem`, `ApiSubcategory`, `ApiGroup`, `ApiSpend`, `ApiIncome`, `ApiAuthCallbackRequest`, `ApiAutocompleteOptions`, `ApiCategoriesMap`, `ApiSubcategoriesMap`)
- [x] 2.2 Import `DayjsDate` from `src/utils.ts` inside `types.ts`

## 3. Move component prop types

- [x] 3.1 Move `ModalBaseProps` into `src/components/modal/ModalBase.tsx` and export it
- [x] 3.2 Move `UI.AutocompleteProps` into `src/components/Autocomplete.tsx` as `AutocompleteProps` and export it
- [x] 3.3 Move `UI.PageProps` into `src/components/Page.tsx` as `PageProps` and export it
- [x] 3.4 Move `UI.Table.*` types into `src/components/Table.tsx` and export them
- [x] 3.5 Move `UI.SpendFilterProps` into `src/components/pages/spends/sub-pages/spend-list/SpendFilters.tsx` as `SpendFilterProps` and export it

## 4. Move hook param types

- [x] 4.1 Move `UI.Hooks.UseSpendCreation.Params` into `src/hooks/useSpendCreation.ts` as `UseSpendCreationParams` and export it
- [x] 4.2 Move `UI.Hooks.UseIncomeCreation.Params` into `src/hooks/useIncomeCreation.ts` as `UseIncomeCreationParams` and export it
- [x] 4.3 Move `UI.Hooks.UseSpendFilters.Params` into `src/hooks/useSpendFilters.ts` as `UseSpendFiltersParams` and export it

## 5. Update consumers to use explicit imports

- [x] 5.1 Update `src/api/mis-gastos/api.ts` to import from `./types`
- [x] 5.2 Update `src/api/mis-gastos/utils.ts` to import from `./types`
- [x] 5.3 Update `src/hooks/useSpendCreation.ts` to import from `../api/mis-gastos/types`
- [x] 5.4 Update `src/hooks/useIncomeCreation.ts` to import from `../api/mis-gastos/types`
- [x] 5.5 Update `src/hooks/useSpendFilters.ts` to import from `../api/mis-gastos/types`
- [x] 5.6 Update all component files that reference `Api.*` or `UI.*` types to use explicit imports
- [x] 5.7 Update `src/constants.ts` to import from `../api/mis-gastos/types`

## 6. Delete types.d.ts and verify

- [x] 6.1 Delete `src/types.d.ts`
- [x] 6.2 Run `tsc --noEmit` and confirm zero type errors
