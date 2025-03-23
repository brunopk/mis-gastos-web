type ModalBaseProps = {
  children: ReactNode
  title: string
  open: boolean
  primaryActionButton: ReactElement
  secondaryActionButton: ReactElement
  onClose: () => void
}

namespace Api {

  type Category = {
    id: number
    name: string,
    subcategories: Subcategory[]
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
