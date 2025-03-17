import { MoreVert } from '@mui/icons-material'
import * as Mui from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { ReactNode, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Drawer from './Drawer'
import DrawerButton from './DrawerButton'
import DrawerHeader from './DrawerHeader'
import SecondaryDrawer from './SecondaryDrawer'
import SecondaryDrawerMobile from './SecondaryDrawerMobile'

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

  const theme = Mui.useTheme()

  const isUpSm = Mui.useMediaQuery(theme.breakpoints.up('sm'))

  const {
    page: { title: dashboardTitle }
  } = location.state || { page: { title: '' } }

  const [mainDrawerOpen, setMainDrawerOpen] = useState<boolean>(false)

  const [secondaryDrawerOpen, setSecondaryDrawerOpen] = useState<boolean>(false)

  const handleMainDrawerOpen = () => setMainDrawerOpen(true)

  const handleSecondaryDrawerToggle = (newOpen: boolean) => {
    setSecondaryDrawerOpen(newOpen)
  }

  const handleThreeDotsIconClick = () => {
    setSecondaryDrawerOpen(true)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <DrawerButton handleDrawerOpen={handleMainDrawerOpen} />
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
      <Drawer
        widthInRem={menuWidthInRem}
        content={sideBarMenu}
        open={mainDrawerOpen}
        setOpen={setMainDrawerOpen}
      />
      {isUpSm && (
        <SecondaryDrawer open={secondaryDrawerOpen} onToggle={handleSecondaryDrawerToggle} />
      )}
      {!isUpSm && (
        <SecondaryDrawerMobile
          open={secondaryDrawerOpen}
          mainDrawerOpen={mainDrawerOpen}
          onToggle={handleSecondaryDrawerToggle}
        />
      )}
    </Box>
  )
}

export default Page
