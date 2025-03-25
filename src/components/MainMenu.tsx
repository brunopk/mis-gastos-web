import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PaidIcon from '@mui/icons-material/Paid'
import ReceiptIcon from '@mui/icons-material/Receipt'
import * as Mui from '@mui/material'
import { styled, useTheme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Dispatch, Fragment, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../routes'
import { MENU_WIDTH_IN_REM } from '../style'
import DrawerHeader from './DrawerHeader'

const List = styled(Mui.List)<Mui.ListProps>(() => ({
  width: `${MENU_WIDTH_IN_REM}rem`
}))

const ListItemButton = Mui.styled(
  Mui.ListItemButton,
  {}
)<Mui.ListItemButtonProps & { selected: boolean }>(({theme}) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        backgroundColor: `${theme.palette.warning.main}!important`
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

  const handleSpendsClick = () => navigate(ROUTES.SPENDS.NEW)

  const handleIncomeClick = () => {
    throw new Error(`Not implemented`)
  }

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
          <ListItem key={0} onClick={() => handleSpendsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(ROUTES.SPENDS.INDEX)}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Spends" />
            </ListItemButton>
          </ListItem>
          <ListItem key={1} onClick={() => handleIncomeClick()} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PaidIcon />
              </ListItemIcon>
              <ListItemText primary="Income" />
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
