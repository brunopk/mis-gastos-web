import { QueryClient } from '@tanstack/react-query'
import { createBrowserRouter, createRoutesFromElements, Route, RouteProps } from 'react-router-dom'
import { apiListLoader } from './api/utils'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import NewSpend from './components/pages/spends/sub-pages/new-spend/NewSpend'
import NewIncome from './components/pages/income/sub-pages/new-income/NewIncome'
import SpendList from './components/pages/spends/sub-pages/spend-list/SpendList'

export const paths = {
  spends: {
    index: '/spends',
    list: '/spends/list',
    new: '/spends/new'
  },
  income: {
    index: '/income',
    new: '/income/new'
  }
}

export const router = (queryClient: QueryClient) => {
  const commonRouteProps: RouteProps = {
    loader: apiListLoader(queryClient),
    errorElement: <ErrorBoundary />
  }

  return createBrowserRouter(
    createRoutesFromElements(
      <Route hydrateFallbackElement={<ErrorBoundary />}>
        <Route {...commonRouteProps} path={paths.spends.list} element={<SpendList />} />
        <Route {...commonRouteProps} path={paths.spends.new} element={<NewSpend />} />
        <Route {...commonRouteProps} path={paths.income.new} element={<NewIncome />} />
        <Route {...commonRouteProps} path="*" element={<NotFound />} />
      </Route>
    )
  )
}
