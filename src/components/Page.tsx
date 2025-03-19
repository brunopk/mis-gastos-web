import { MoreVert } from '@mui/icons-material'
import * as Mui from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { MouseEventHandler, ReactNode, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Drawer from './Drawer'
import DrawerButton from './DrawerButton'
import DrawerHeader from './DrawerHeader'

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
  sideBarMenu?: ReactNode
  children: ReactNode
  menuWidthInRem?: number
  onThreeDotsIconClick?: () => void
}

function Page({ children, menuWidthInRem, sideBarMenu, onThreeDotsIconClick }: PageProps) {
  const location = useLocation()

  const {
    page: { title: dashboardTitle }
  } = location.state || { page: { title: '' } }

  const [mainDrawerOpen, setMainDrawerOpen] = useState<boolean>(false)

  const handleMainDrawerOpen = () => setMainDrawerOpen(true)

  const handleThreeDotsIconClick = useCallback(() => {
    if (typeof onThreeDotsIconClick !== 'undefined')
      onThreeDotsIconClick()
  }, [onThreeDotsIconClick])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <DrawerButton handleDrawerOpen={handleMainDrawerOpen} />
          <DashboardTitle variant="h6" noWrap component="div">
            {dashboardTitle}
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
        {children}
      </Main>

      <Drawer
        widthInRem={menuWidthInRem}
        content={sideBarMenu}
        open={mainDrawerOpen}
        setOpen={setMainDrawerOpen}
      />
    </Box>
  )
}

export default Page
