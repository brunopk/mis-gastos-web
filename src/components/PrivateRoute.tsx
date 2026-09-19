import { PATHS } from '../constants'
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/

interface PrivateRoute {
  isPrivate: boolean
  isAuthenticated: boolean
}

/**************************************************************************************************/
/*                                         MAIN COMPONENT                                         */
/**************************************************************************************************/

function PrivateRoute() {
  const {
    loginInformation: { isAuthenticated }
  } = useContext(UserContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} />
}

/**************************************************************************************************/
/*                                           EXPORTS                                              */
/**************************************************************************************************/

export default PrivateRoute
