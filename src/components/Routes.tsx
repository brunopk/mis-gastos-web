import { QueryClient } from '@tanstack/react-query'
import * as RRD from 'react-router-dom'
import * as MisGastosUtils from '../api/mis-gastos/utils'
import { PATHS } from '../constants'
import ErrorBoundary from './ErrorBoundary'
import NotFound from './NotFound'
import IncomeList from './pages/income/sub-pages/income-list/IncomeList'
import NewIncome from './pages/income/sub-pages/new-income/NewIncome'
import Login from './pages/login/Login'
import NewSpend from './pages/spends/sub-pages/new-spend/NewSpend'
import SpendList from './pages/spends/sub-pages/spend-list/SpendList'
import PrivateRoute from './PrivateRoute'

const Route = RRD.Route

const Navigate = RRD.Navigate

const createBrowserRouter = RRD.createBrowserRouter

const createRoutesFromElements = RRD.createRoutesFromElements

export const router = (queryClient: QueryClient) => {
  const landingPage = PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW
  const commonRouteProps: RRD.RouteProps = {
    loader: MisGastosUtils.loaderFunctionBuilder(queryClient),
    errorElement: <ErrorBoundary />
  }

  return createBrowserRouter(
    createRoutesFromElements(
      <Route hydrateFallbackElement={<ErrorBoundary />}>
        <Route path="/" element={<Navigate to={landingPage} replace />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.SPENDS.INDEX} element={<PrivateRoute />}>
          <Route {...commonRouteProps} path={PATHS.SPENDS.LIST} element={<SpendList />} />
          <Route {...commonRouteProps} path={PATHS.SPENDS.NEW} element={<NewSpend />} />
        </Route>
        <Route path={PATHS.INCOME.INDEX} element={<PrivateRoute />}>
          <Route {...commonRouteProps} path={PATHS.INCOME.NEW} element={<NewIncome />} />
          <Route {...commonRouteProps} path={PATHS.INCOME.LIST} element={<IncomeList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )
}
