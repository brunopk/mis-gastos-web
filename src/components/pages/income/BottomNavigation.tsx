import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import * as Mui from '@mui/material'
import { SyntheticEvent } from 'react'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../../../constants'

function mapLocationToValue(location: Location) {
  if (location.pathname.startsWith(PATHS.INCOME.INDEX + PATHS.INCOME.NEW)) return 0
  else if (location.pathname.startsWith(PATHS.INCOME.INDEX + PATHS.INCOME.LIST)) return 1
  else
    throw new Error(
      `Cannot obtain initial value for BottomNavigation with this location : ${JSON.stringify(location)}`
    )
}

function BottomNavigation() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate(PATHS.INCOME.INDEX + PATHS.INCOME.NEW)
        break
      case 1:
        navigate(PATHS.INCOME.INDEX + PATHS.INCOME.LIST)
        break
      default:
        throw new Error(`Unknown option ${newValue}`)
    }
  }

  const bottomNavigationProps: Mui.BottomNavigationProps = {
    value: mapLocationToValue(location),
    showLabels: true,
    onChange: handleChange
  }

  return (
    <Mui.BottomNavigation {...bottomNavigationProps}>
      <Mui.BottomNavigationAction label="New" icon={<AddIcon />} />
      <Mui.BottomNavigationAction label="List" icon={<ListIcon />} />
    </Mui.BottomNavigation>
  )
}

export default BottomNavigation
