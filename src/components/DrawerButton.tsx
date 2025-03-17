import MenuIcon from '@mui/icons-material/Menu'
import { IconButton } from '@mui/material'

type DrawerButtonProps = {
  handleDrawerOpen: () => void
}

function DrawerButton({ handleDrawerOpen }: DrawerButtonProps) {
  return (
    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
      <MenuIcon />
    </IconButton>
  )
}

export default DrawerButton
