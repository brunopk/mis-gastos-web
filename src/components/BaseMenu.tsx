import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SettingsIcon from '@mui/icons-material/Settings'
import SummarizeIcon from '@mui/icons-material/Summarize'
import { useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Dispatch, Fragment, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BOOKMARKS_PATH, SETTINGS_PATH, STATS_PATH } from '../config'
import DrawerHeader from './DrawerHeader'

const DEFAULT_MENU_WIDTH_IN_REM = 15

type BaseMenuProps = {
  content?: ReactNode
  open: boolean
  widthInRem?: number
  setOpen: Dispatch<boolean>
}

function BaseMenu({ content, open, widthInRem, setOpen }: BaseMenuProps) {
  widthInRem = typeof widthInRem === 'undefined' ? DEFAULT_MENU_WIDTH_IN_REM : widthInRem

  const theme = useTheme()

  const handleDrawerClose = () => setOpen(false)

  const navigate = useNavigate()

  const handleBackClick = () => navigate(-1)

  const bookmarksTitle = 'Bookmarks'
  const handleStatsClick = () => navigate(STATS_PATH, { state: { page: { title: statsTitle } } })

  const statsTitle = 'Stats'
  const handleBookmarksClick = () =>
    navigate(BOOKMARKS_PATH, { state: { page: { title: bookmarksTitle } } })

  const settingsTitle = 'Settings'
  const handleSettingsClick = () =>
    navigate(SETTINGS_PATH, { state: { page: { title: settingsTitle } } })

  return (
    <Fragment>
      <Drawer anchor="left" open={open} onClose={handleDrawerClose} sx={{ width: '24rem' }}>
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
        <List sx={{ width: `${widthInRem}rem` }}>
          <ListItem key={0} onClick={() => handleBookmarksClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(BOOKMARKS_PATH)}>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary={bookmarksTitle} />
            </ListItemButton>
          </ListItem>
          <ListItem key={1} onClick={() => handleStatsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(STATS_PATH)}>
              <ListItemIcon>
                <SummarizeIcon />
              </ListItemIcon>
              <ListItemText primary={statsTitle} />
            </ListItemButton>
          </ListItem>
          <ListItem key={2} onClick={() => handleSettingsClick()} disablePadding>
            <ListItemButton selected={location.pathname.startsWith(SETTINGS_PATH)}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={settingsTitle} />
            </ListItemButton>
          </ListItem>
          <ListItem key={3} onClick={() => handleBackClick()} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
              <ListItemText primary="Back" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Fragment>
  )
}

export default BaseMenu
