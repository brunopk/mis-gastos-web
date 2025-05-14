import AddCircle from '@mui/icons-material/AddCircle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import * as Mui from '@mui/material'
import { styled, useTheme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Dispatch, Fragment, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '../Routes'
import { MENU_WIDTH_IN_REM } from '../constants'
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

const Divider = styled(Mui.Divider)<Mui.DividerProps>(() => ({
  width: `${MENU_WIDTH_IN_REM}rem`
}))

type BaseMenuProps = {
  content?: ReactNode
  open: boolean
  setOpen: Dispatch<boolean>
}

function MainMenu({ content, open, setOpen }: BaseMenuProps) {
  const theme = useTheme()

  const navigate = useNavigate()

  const handleSpendsClick = () => navigate(paths.spends.list)

  const handleIncomeClick = () => navigate(paths.income.list)

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
            <ListItemButton selected={location.pathname.startsWith(paths.income.index)}>
              <ListItemIcon selected={location.pathname.startsWith(paths.income.index)}>
                <AddCircle />
              </ListItemIcon>
              <ListItemText primary="Income" />
            </ListItemButton>
          </ListItem>
          <ListItem key={0} onClick={() => handleSpendsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(paths.spends.index)}>
              <ListItemIcon selected={location.pathname.startsWith(paths.spends.index)}>
                <RemoveCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Spends" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {typeof content !== 'undefined' ? <List>{content}</List> : <></>}
      </Mui.Drawer>
    </Fragment>
  )
}

export default MainMenu
