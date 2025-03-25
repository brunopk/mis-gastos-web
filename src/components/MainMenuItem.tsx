import * as Mui from '@mui/material'
import { ReactNode, useCallback } from 'react'

type MainMenuItemProps = {
  text: string
  icon: ReactNode
  selected: boolean
  onClick: () => void
}

function MainMenuItem({ text, icon, selected, onClick }: MainMenuItemProps) {
  const handleListItemClick = useCallback(() => {
    onClick()
  }, [onClick])

  return (
    <Mui.ListItem onClick={handleListItemClick} disablePadding>
      <Mui.ListItemButton selected={selected}>
        <Mui.ListItemIcon>{icon}</Mui.ListItemIcon>
        <Mui.ListItemText>{text}</Mui.ListItemText>
      </Mui.ListItemButton>
    </Mui.ListItem>
  )
}

export default MainMenuItem
