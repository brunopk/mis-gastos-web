// TODO: Move ModalBaseProps to UI.Components (and other components too)

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
  interface ListItem {
    id: number
    name: string
    accountIds?: number[]
  }

  type Account = ListItem

  type Category = ListItem

  type Subcategory = ListItem & {
    categoryId: number
  }

  type Group = ListItem & {
    subcategoryId: number
  }

  interface DescriptionAutocompleteOptions {
    search: string
    options: string[]
  }

  interface Spend {
    id?: number
    date: string
    categoryId: number
    subcategoryId: number | null
    groupId: number | null
    accountId: number
    description?: string
    value: number
  }

  interface Income {
    id: number
    date: string
    incomeTypeId: number
    accountId: number
    description?: string
    value: number
    spend?: Spend
  }
}

declare namespace UI {

  namespace Hooks {

    namespace UseSpendFilters {

      interface Params {
        filters: {
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

    interface Column<R, B> {
      id: keyof R | keyof B
      label: string
      isButton?: boolean
      minWidth?: number
      format?: Formatter
    }

    interface Button<B> {
      id: keyof B
      label: string
      clickHandler: MouseEventHandler<HTMLButtonElement>
    }
  }

  interface SpendFilterProps {
    filters: {
      categoryIds: number[] | null
      subcategoryIds: number[] | null
      groupIds: number[] | null
      accountIds: number[] | null
    }
    isModalOpen: boolean
    onModalClose: () => void
    onFiltersSet: (
      categoryIds: number[],
      subcategoryIds: number[],
      groupIds: number[],
      accountIds: number[]
    ) => void
  }

  type PageProps = {
    mainMenu?: ReactNode
    children: ReactNode
    isFetching?: boolean
    onThreeDotsIconClick?: () => void
  }
}
