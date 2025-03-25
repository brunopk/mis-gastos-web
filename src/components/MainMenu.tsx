import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ReceiptIcon from '@mui/icons-material/Receipt'
import * as Mui from '@mui/material'
import { styled, useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Dispatch, Fragment, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../routes'
import { MENU_WIDTH_IN_REM } from '../style'
import DrawerHeader from './DrawerHeader'

// TODO: use styled components

const List = styled(Mui.List)<Mui.ListProps>(() => ({
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

  const handleBackClick = () => navigate(-1)

  const handleDrawerClose = () => setOpen(false)

  return (
    <Fragment>
      <Mui.Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ width: `${MENU_WIDTH_IN_REM}rem` }} />
        {typeof content !== 'undefined' ? (
          <>
            <List>{content}</List>
            <Divider sx={{ width: `${MENU_WIDTH_IN_REM}rem` }} />
          </>
        ) : (
          <></>
        )}
        <List>
          <ListItem key={0} onClick={() => handleSpendsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(ROUTES.SPENDS.NEW)}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Spends" />
            </ListItemButton>
          </ListItem>
          <ListItem key={1} onClick={() => handleBackClick()} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
              <ListItemText primary="Back" />
            </ListItemButton>
          </ListItem>
        </List>
      </Mui.Drawer>
    </Fragment>
  )
}

export default MainMenu
