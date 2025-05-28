import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../../../constants'
import MainMenuItem from '../../MainMenuItem'

function MainMenu() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleNewIncomeClick = () => navigate(PATHS.INCOME.INDEX + PATHS.INCOME.NEW)

  const handleIncomeListClick = () => navigate(PATHS.INCOME.INDEX + PATHS.INCOME.LIST)

  return (
    <>
      <MainMenuItem
        text="New"
        onClick={handleNewIncomeClick}
        icon={<AddIcon />}
        selected={location.pathname.startsWith(PATHS.INCOME.INDEX + PATHS.INCOME.NEW)}
      />
      <MainMenuItem
        text="List"
        onClick={handleIncomeListClick}
        icon={<ListIcon />}
        selected={location.pathname.startsWith(PATHS.INCOME.INDEX + PATHS.INCOME.LIST)}
      />
    </>
  )
}

export default MainMenu
