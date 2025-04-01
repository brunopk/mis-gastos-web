type ModalBaseProps = {
  children: ReactNode
  title: string
  open: boolean
  primaryActionButton: ReactElement
  secondaryActionButton: ReactElement
  onClose: () => void
}

declare namespace Api {

  type Category = {
    id: number
    name: string,
  }
  
  type Subcategory = {
    id: number
    name: string
    groups: Group[]
  }
  
  
  type Group = {
    id: number
    name: string
  }
}

declare namespace UI {

  type SnackBarMessage = {
    text: string,
    severity?: SnackBarSeverity
  }

  type SnackBarSeverity = 'success' | 'error' | 'warning'
  
}
