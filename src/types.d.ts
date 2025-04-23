
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

  interface Spend {
    id: number
    date: string
    categoryId: number | null
    subcategoryId: number | null
    groupId: number | null
    accountId: number
    description: string
    value: number
  }
}

declare namespace UI {

  type ModalBaseProps = {
    children: ReactNode
    open: boolean
    primaryActionButton: ReactElement
    secondaryActionButton: ReactElement
    title?: string
    onClose: () => void
  }

  type ConfirmationModalProps = {
    open: boolean
    text: string
    onAccept: () => void
    onCancel: () => void
  }
  
  type PageProps = {
    mainMenu?: ReactNode
    children: ReactNode
    isFetching?: boolean
    onThreeDotsIconClick?: () => void
  }

  type SnackBarMessage = {
    text: string
    severity?: SnackBarSeverity
  }

  type SnackBarSeverity = 'success' | 'error' | 'warning'
}
