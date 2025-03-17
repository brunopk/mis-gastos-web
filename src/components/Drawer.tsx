import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PaidIcon from '@mui/icons-material/Paid'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
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
import { SPENDS_PATH } from '../config'
import DrawerHeader from './DrawerHeader'

const DEFAULT_MENU_WIDTH_IN_REM = 15

const List = styled(Mui.List)<Mui.ListProps>(() => ({
  width: `${DEFAULT_MENU_WIDTH_IN_REM}rem`
}))

type BaseMenuProps = {
  content?: ReactNode
  open: boolean
  widthInRem?: number
  setOpen: Dispatch<boolean>
}

function Drawer({ content, open, widthInRem, setOpen }: BaseMenuProps) {
  const theme = useTheme()

  const navigate = useNavigate()

  const spendsTitle = 'Spends'

  const handleSpendsClick = () => navigate(SPENDS_PATH, { state: { page: { title: spendsTitle } } })

  const handleBackClick = () => navigate(-1)

  const handleDrawerClose = () => setOpen(false)

  return (
    <Fragment>
      <Mui.Drawer anchor="left" open={open} onClose={handleDrawerClose} >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ width: `${widthInRem}rem` }} />
        {typeof content !== 'undefined' ? (
          <>
            <List>{content}</List>
            <Divider sx={{ width: `${widthInRem}rem` }} />
          </>
        ) : (
          <></>
        )}
        <List>
          <ListItem key={0} onClick={() => handleSpendsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(SPENDS_PATH)}>
              <ListItemIcon>
                <PaidIcon />
              </ListItemIcon>
              <ListItemText primary={spendsTitle} />
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

export default Drawer
