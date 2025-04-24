import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate } from 'react-router-dom'
import { paths } from '../../../Routes'
import MainMenuItem from '../../MainMenuItem'

function MainMenu() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleNewIncomeClick = () => navigate(paths.spends.new)

  const handleIncomeListClick = () => navigate(paths.spends.list)

  return (
    <>
      <MainMenuItem
        text="List"
        onClick={handleIncomeListClick}
        icon={<ListIcon />}
        selected={location.pathname.startsWith(paths.income.list)}
      />
      <MainMenuItem
        text="New"
        onClick={handleNewIncomeClick}
        icon={<AddIcon />}
        selected={location.pathname.startsWith(paths.income.new)}
      />
    </>
  )
}

export default MainMenu
