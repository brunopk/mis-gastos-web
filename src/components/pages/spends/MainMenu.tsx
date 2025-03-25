import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../../../routes'
import MainMenuItem from '../../MainMenuItem'

function MainMenu() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleNewSpendClick = () => navigate(ROUTES.SPENDS.NEW)

  const handleSpendListClick = () => navigate(ROUTES.SPENDS.LIST)

  return (
    <>
      <MainMenuItem
        text="New"
        onClick={handleNewSpendClick}
        icon={<AddIcon />}
        selected={location.pathname.startsWith(ROUTES.SPENDS.NEW)}
      />
      <MainMenuItem
        text="List"
        onClick={handleSpendListClick}
        icon={<ListIcon />}
        selected={location.pathname.startsWith(ROUTES.SPENDS.LIST)}
      />
    </>
  )
}

export default MainMenu
