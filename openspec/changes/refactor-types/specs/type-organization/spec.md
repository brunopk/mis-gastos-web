## ADDED Requirements

### Requirement: API domain types are defined in a dedicated module
The project SHALL define all API domain types (`ApiListItem`, `ApiSubcategory`, `ApiGroup`, `ApiSpend`, `ApiIncome`, `ApiAuthCallbackRequest`, `ApiAutocompleteOptions`, `ApiCategoriesMap`, `ApiSubcategoriesMap`) in `src/api/mis-gastos/types.ts` and export them explicitly.

#### Scenario: API types are importable from the types module
- **WHEN** a file needs an API domain type
- **THEN** it SHALL import it explicitly from `src/api/mis-gastos/types.ts`

#### Scenario: No ambient API types exist
- **WHEN** the codebase is compiled
- **THEN** there SHALL be no globally available `Api.*` namespace

### Requirement: Component prop types are co-located with their component
Each component SHALL define and export its own prop types in the same file, not in a shared global file.

#### Scenario: Prop type is importable from the component file
- **WHEN** a file needs a component's prop type
- **THEN** it SHALL import it from the component's own file

#### Scenario: No ambient UI types exist
- **WHEN** the codebase is compiled
- **THEN** there SHALL be no globally available `UI.*` namespace

### Requirement: Hook param types are co-located with their hook
Each hook SHALL define and export its own param types in the same file.

#### Scenario: Hook param type is importable from the hook file
- **WHEN** a file needs a hook's param type
- **THEN** it SHALL import it from the hook's own file

### Requirement: No ambient declaration files for application types
The project SHALL NOT use `.d.ts` files to declare application-level types. All types SHALL be in regular `.ts` or `.tsx` files with explicit exports.

#### Scenario: No types.d.ts file exists
- **WHEN** the codebase is compiled
- **THEN** `src/types.d.ts` SHALL NOT exist

#### Scenario: DayjsDate is importable from utils
- **WHEN** a file needs the `DayjsDate` type alias
- **THEN** it SHALL import it from `src/utils.ts`
