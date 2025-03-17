import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import * as Mui from '@mui/material'
import { useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { Fragment } from 'react'
import SecondaryDrawerHeader from './SecondaryDrawerHeader'

const DEFAULT_WIDTH_IN_REM = 15


type SecondaryDrawerProps = {
  open: boolean
  onToggle: (newOpen: boolean) => void
}

function SecondaryDrawer({ open, onToggle }: SecondaryDrawerProps) {
  const theme = useTheme()

  const handleDrawerClose = () => onToggle(!open)

  return (
    <Fragment>
      <Mui.Drawer anchor="right" open={open} onClose={handleDrawerClose}>
        <SecondaryDrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </SecondaryDrawerHeader>
        <Divider sx={{ width: `${DEFAULT_WIDTH_IN_REM}rem` }} />
        <Mui.Typography>Work in progress</Mui.Typography>    
      </Mui.Drawer>
    </Fragment>
  )
}

export default SecondaryDrawer
