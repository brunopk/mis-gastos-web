type ModalBaseProps = {
  children: ReactNode
  title: string
  open: boolean
  primaryActionButton: ReactElement
  secondaryActionButton: ReactElement
  onClose: () => void
}

declare namespace Api {

  type ListItem = {
    id: number,
    name: string
  }

  type Account = ListItem

  type Category = ListItem
  
  type Subcategory = ListItem & {
    categoryId: number
  }
  
  type Group = ListItem & {
    subcategoryId: number
  }

  type FixedLists = {
    categories: Category[],
    subcategories: Subcategory[],
    groups: Group[],
    accounts: Account[]
  }
}

declare namespace UI {

  type SnackBarMessage = {
    text: string,
    severity?: SnackBarSeverity
  }

  type SnackBarSeverity = 'success' | 'error' | 'warning'
  
}
