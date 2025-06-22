import AddCircle from '@mui/icons-material/AddCircle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import * as Mui from '@mui/material'
import { styled, useTheme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Dispatch, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { MENU_WIDTH_IN_REM, PATHS } from '../constants'
import DrawerHeader from './DrawerHeader'

const List = styled(Mui.List)<Mui.ListProps>(() => ({
  width: `${MENU_WIDTH_IN_REM}rem`
}))

const ListItemButton = Mui.styled(
  Mui.ListItemButton,
  {}
)<Mui.ListItemButtonProps & { selected: boolean }>(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        backgroundColor: `${theme.palette.primary.main}!important`,
        color: theme.palette.getContrastText(theme.palette.primary.main)
      }
    }
  ]
}))

const ListItemIcon = Mui.styled(
  Mui.ListItemIcon,
  {}
)<Mui.ListItemIconProps & { selected: boolean }>(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        color: theme.palette.getContrastText(theme.palette.primary.main)
      }
    }
  ]
}))

type BaseMenuProps = {
  open: boolean
  setOpen: Dispatch<boolean>
}

function MainMenu({ open, setOpen }: BaseMenuProps) {
  const theme = useTheme()

  const navigate = useNavigate()

  const handleSpendsClick = () => navigate(PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW)

  const handleIncomeClick = () => navigate(PATHS.INCOME.INDEX + PATHS.INCOME.NEW)

  const handleDrawerClose = () => setOpen(false)

  return (
    <Fragment>
      <Mui.Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          <ListItem key={1} onClick={() => handleIncomeClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(PATHS.INCOME.INDEX)}>
              <ListItemIcon selected={location.pathname.startsWith(PATHS.INCOME.INDEX)}>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary="Income" />
            </ListItemButton>
          </ListItem>
          <ListItem key={0} onClick={() => handleSpendsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(PATHS.SPENDS.INDEX)}>
              <ListItemIcon selected={location.pathname.startsWith(PATHS.SPENDS.INDEX)}>
                <RemoveCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Spends" />
            </ListItemButton>
          </ListItem>
        </List>
      </Mui.Drawer>
    </Fragment>
  )
}

export default MainMenu
