import { MoreVert } from '@mui/icons-material'
import * as Mui from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { ReactNode, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useStaticApiLists from '../hooks/useStaticApiLists'
import { getPageTitle } from '../utils'
import DrawerButton from './DrawerButton'
import DrawerHeader from './DrawerHeader'
import MainMenu from './MainMenu'

const Main = styled('main')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 0.5rem'
}))

const DashboardTitle = styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  paddingLeft: '2rem',
  display: 'flex',
  flexGrow: 1
}))

type PageProps = {
  mainMenu?: ReactNode
  children: ReactNode
  onThreeDotsIconClick?: () => void
}

function Page({ children, mainMenu, onThreeDotsIconClick }: PageProps) {
  const location = useLocation()

  const title = getPageTitle(location.pathname)

  const [mainMenuOpen, setMainMenuOpen] = useState<boolean>(false)

  const { isFetching } = useStaticApiLists()
  
  const handleDrawerButtonClick = () => setMainMenuOpen(true)

  const handleThreeDotsIconClick = useCallback(() => {
    if (typeof onThreeDotsIconClick !== 'undefined') onThreeDotsIconClick()
  }, [onThreeDotsIconClick])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <DrawerButton handleDrawerOpen={handleDrawerButtonClick} />
          <DashboardTitle variant="h6" noWrap component="div">
            {title}
          </DashboardTitle>
          {typeof onThreeDotsIconClick !== 'undefined' && (
            <Mui.IconButton color="inherit" onClick={handleThreeDotsIconClick}>
              <MoreVert />
            </Mui.IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Main>
        <DrawerHeader />
        {isFetching ? (
          <Mui.Backdrop open>
            <Mui.CircularProgress color="inherit" />
          </Mui.Backdrop>
        ) : (
          children
        )}
      </Main>
      <MainMenu content={mainMenu} open={mainMenuOpen} setOpen={setMainMenuOpen} />
    </Box>
  )
}

export default Page
