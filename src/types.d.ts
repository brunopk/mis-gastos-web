// TODO: Move ModalBaseProps to UI.Components (and other components too)

type DayjsDate = ReturnType<typeof import('dayjs')>

type ModalBaseProps = {
  children: ReactNode
  title: string
  open: boolean
  primaryActionButton: ReactElement
  secondaryActionButton: ReactElement
  onClose: () => void
}

// TODO: convert types to (interfaces if possible)

declare namespace Api {
  interface AuthCallbackRequest {
    authorizationCode: string
    codeVerifier: string
  }

  interface ListItem {
    id: number
    name: string
    accountIds?: number[]
  }

  interface Subcategory extends ListItem {
    categoryId: number
  }

  interface Group extends ListItem {
    subcategoryId: number
  }

  interface AutocompleteOptions {
    query: string
    options: string[]
  }

  interface Spend {
    id?: number
    date: DayjsDate
    categoryId: number
    subcategoryId: number | null
    groupId: number | null
    accountId: number
    description?: string
    value: number
  }

  interface Income {
    id?: number
    date: DayjsDate
    incomeTypeId: number
    accountId: number
    description?: string
    value: number
    spend?: Spend
  }

  type CategoriesMap = Map<number, ListItem>

  type SubcategoriesMap = Map<number, Subcategory>
}

// TODO: create different namespaces (Components, Hooks, etc)and delete UI namespace

declare namespace UI {
  namespace Hooks {
    namespace UseSpendCreation {
      interface Params {
        defaultCategoryId: number | null
        defaultSubcategoryId: number | null
        defaultGroupId: number | null
        defaultAccountId: number | null
      }
    }

    namespace UseIncomeCreation {
      interface Params {
        defaultIncomeTypeId: number | null
        excludedIncomeTypeIds: number[]
      }
    }

    namespace UseSpendFilters {
      interface Params {
        filters: {
          startDate: DayjsDate
          finalDate: DayjsDate
          categoryIds: number[] | null
          subcategoryIds: number[] | null
          groupIds: number[] | null
          accountIds: number[] | null
        }
      }
    }
  }

  namespace Table {
    interface TableProps<R, B> {
      rows: BaseRow<R, B>[]
      columns: Column<D>[]
    }

    interface BaseRow<R, B> {
      id: number
      data: R
      buttons?: Button<B>[]
    }

    interface DataColumn<R> {
      id: string
      label: string
      isButton?: false
      minWidth?: number
      getValue: (data: R) => ReactNode
    }

    interface ButtonColumn<B> {
      id: keyof B
      label: string
      isButton: true
      minWidth?: number
    }

    type Column<R, B> = DataColumn<R> | ButtonColumn<B>

    interface Button<B> {
      id: keyof B
      label: string
      clickHandler: MouseEventHandler<HTMLButtonElement>
    }
  }

  interface AutocompleteProps {
    reset: boolean
    queryFn: (query: string) => Promise<Api.AutocompleteOptions>
    onChange: (text: string) => void
  }

  interface SpendFilterProps {
    isModalOpen: boolean
    filters: {
      startDate: DayjsDate
      finalDate: DayjsDate
      categoryIds: number[] | null
      subcategoryIds: number[] | null
      groupIds: number[] | null
      accountIds: number[] | null
    }
    onModalClose: () => void
    onFiltersSet: (
      startDate: DayjsDate,
      finalDate: DayjsDate,
      categoryIds: number[],
      subcategoryIds: number[],
      groupIds: number[],
      accountIds: number[]
    ) => void
  }

  type PageProps = {
    children: ReactNode
    bottomNavigation?: ReactNode
    isFetching?: boolean
    onThreeDotsIconClick?: () => void
  }
}
