import * as Mui from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { ReactNode,  useState } from 'react'
import { useLocation } from 'react-router-dom'
import BaseMenu from './BaseMenu'
import DrawerButton from './DrawerButton'
import DrawerHeader from './DrawerHeader'
import { MoreVert } from '@mui/icons-material'


const Main = styled('main')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  flexGrow: 1,
  padding: '2rem 1rem 1rem 1rem'
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
}

function Page({ children, menuWidthInRem, sideBarMenu }: PageProps) {
  const location = useLocation()
  
  const {
    page: { title: dashboardTitle }
  } = location.state || { page: { title: '' } }


  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)


  const handleDrawerOpen = () => setDrawerOpen(true)

  const handleThreeDotsIconClick = () => {
    alert('Not Implemented')
  }

  return (
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed">
          <Toolbar>
            <DrawerButton handleDrawerOpen={handleDrawerOpen} />
            <DashboardTitle variant="h6" noWrap component="div">
              {dashboardTitle}
            </DashboardTitle>
            <Mui.IconButton color="inherit" onClick={handleThreeDotsIconClick}>
              <MoreVert />
            </Mui.IconButton>
          </Toolbar>
        </AppBar>
        <Main>
          <DrawerHeader />
          {children}
        </Main>
        <BaseMenu
          widthInRem={menuWidthInRem}
          content={sideBarMenu}
          open={drawerOpen}
          setOpen={setDrawerOpen}
        />
      </Box>
  )
}

export default Page
