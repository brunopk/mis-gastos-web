import { Navigate, Outlet } from 'react-router-dom';
import { PATHS } from '../constants';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

interface PrivateRoute {
  isPrivate: boolean, 
  isAuthenticated: boolean
}

function PrivateRoute() {
  const { loginInformation: { isAuthenticated } } = useContext(UserContext)
  const ENV = import.meta.env
  return !ENV.PROD || isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} />;
};

export default PrivateRoute;
