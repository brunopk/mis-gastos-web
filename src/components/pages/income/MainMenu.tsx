import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate } from 'react-router-dom'
import { paths } from '../../../Routes'
import MainMenuItem from '../../MainMenuItem'

function MainMenu() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleNewIncomeClick = () => navigate(paths.income.new)

  const handleIncomeListClick = () => navigate(paths.income.list)

  return (
    <>
      <MainMenuItem
        text="New"
        onClick={handleNewIncomeClick}
        icon={<AddIcon />}
        selected={location.pathname.startsWith(paths.income.new)}
      />
      <MainMenuItem
        text="List"
        onClick={handleIncomeListClick}
        icon={<ListIcon />}
        selected={location.pathname.startsWith(paths.income.list)}
      />
    </>
  )
}

export default MainMenu
