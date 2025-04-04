import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import { useLocation, useNavigate } from 'react-router-dom'
import { paths } from '../../../Routes'
import MainMenuItem from '../../MainMenuItem'

function MainMenu() {
  const navigate = useNavigate()

  const location = useLocation()

  const handleNewSpendClick = () => navigate(paths.spends.new)

  const handleSpendListClick = () => navigate(paths.spends.list)

  return (
    <>
      <MainMenuItem
        text="New"
        onClick={handleNewSpendClick}
        icon={<AddIcon />}
        selected={location.pathname.startsWith(paths.spends.new)}
      />
      <MainMenuItem
        text="List"
        onClick={handleSpendListClick}
        icon={<ListIcon />}
        selected={location.pathname.startsWith(paths.spends.list)}
      />
    </>
  )
}

export default MainMenu
