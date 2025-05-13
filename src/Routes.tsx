import { QueryClient } from '@tanstack/react-query'
import { createBrowserRouter, createRoutesFromElements, Route, RouteProps } from 'react-router-dom'
import * as api from './api/mis-gastos'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import IncomeList from './components/pages/income/sub-pages/income-list/IncomeList'
import NewIncome from './components/pages/income/sub-pages/new-income/NewIncome'
import Login from './components/pages/login/Login'
import NewSpend from './components/pages/spends/sub-pages/new-spend/NewSpend'
import SpendList from './components/pages/spends/sub-pages/spend-list/SpendList'

export const paths = {
  login: '/login',
  spends: {
    index: '/spends',
    list: '/spends/list',
    new: '/spends/new'
  },
  income: {
    index: '/income',
    new: '/income/new',
    list: '/income/list'
  }
}

export const router = (queryClient: QueryClient) => {
  const commonRouteProps: RouteProps = {
    loader: api.utils.buildListLoaderFunction(queryClient),
    errorElement: <ErrorBoundary />
  }

  return createBrowserRouter(
    createRoutesFromElements(
      <Route hydrateFallbackElement={<ErrorBoundary />}>
        <Route path={paths.login} element={<Login />} />
        <Route {...commonRouteProps} path={paths.spends.list} element={<SpendList />} />
        <Route {...commonRouteProps} path={paths.spends.new} element={<NewSpend />} />
        <Route {...commonRouteProps} path={paths.income.new} element={<NewIncome />} />
        <Route {...commonRouteProps} path={paths.income.list} element={<IncomeList />} />
        <Route {...commonRouteProps} path="*" element={<NotFound />} />
      </Route>
    )
  )
}
