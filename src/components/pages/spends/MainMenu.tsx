import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../../../constants'
import MainMenuItem from '../../MainMenuItem'

function MainMenu() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleNewSpendClick = () => navigate(PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW)

  const handleSpendListClick = () => navigate(PATHS.SPENDS.INDEX + PATHS.SPENDS.LIST)

  return (
    <>
      <MainMenuItem
        text="New"
        onClick={handleNewSpendClick}
        icon={<AddIcon />}
        selected={location.pathname.startsWith(PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW)}
      />
      <MainMenuItem
        text="List"
        onClick={handleSpendListClick}
        icon={<ListIcon />}
        selected={location.pathname.startsWith(PATHS.SPENDS.INDEX + PATHS.SPENDS.LIST)}
      />
    </>
  )
}

export default MainMenu
