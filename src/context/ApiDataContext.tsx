import { useQueries } from '@tanstack/react-query'
import { createContext, ReactNode, useEffect, useMemo } from 'react'
import * as ApiQuery from '../api/mis-gastos'
import useSnackBar from '../hooks/useSnackBar'

const ApiDataContext = createContext<ApiDataContextValue>({
  isFetching: false,
  isReady: false,
  categories: [],
  subcategories: [],
  groups: [],
  accounts: []
})

type ApiDataContextValue = {
  isFetching: boolean
  isReady: boolean
  categories: Api.Category[]
  subcategories: Api.Subcategory[]
  groups: Api.Group[]
  accounts: Api.Account[]
}

type ApiDataProviderProps = {
  children: ReactNode
}

function ApiDataProvider({ children }: ApiDataProviderProps) {
  const { pushSnackBarMessage } = useSnackBar()

  const queryCommonAttributes = {
    staleTime: Infinity,
    retry: 2
  }

  const queries = useQueries({
    queries: [
      { ...queryCommonAttributes, queryKey: ['categories'], queryFn: ApiQuery.getCategories },
      { ...queryCommonAttributes, queryKey: ['subcategories'], queryFn: ApiQuery.getSubcategories },
      { ...queryCommonAttributes, queryKey: ['groups'], queryFn: ApiQuery.getGroups },
      { ...queryCommonAttributes, queryKey: ['accounts'], queryFn: ApiQuery.getAccounts }
    ]
  })

  const isFetching = queries.filter((query) => query.isFetching).length > 0

  const isError = queries.filter((query) => query.isError).length > 0

  const isEmpty = queries.filter((query) => query.data && query.data.length > 0).length == 0

  const error = isError ? queries.filter((query) => query.error)[0].error : null

  const contextValue: ApiDataContextValue = useMemo(() => {
    if (!isEmpty) {
      return {
        isFetching,
        isReady: true,
        categories: queries[0].data!,
        subcategories: queries[1].data!,
        groups: queries[2].data!,
        accounts: queries[3].data!
      }
    } else {
      return {
        isFetching,
        isReady: false,
        categories: [],
        subcategories: [],
        groups: [],
        accounts: []
      }
    }
  }, [queries, isFetching, isEmpty])

  useEffect(() => {
    if (error) {
      const severity: UI.SnackBarSeverity =
        (error as ApiQuery.ApiError).statusCode < 500 ? 'warning' : 'error'
      pushSnackBarMessage({ text: `${error.name} ${error.message}`, severity })
    }
  }, [error, pushSnackBarMessage])

  return <ApiDataContext.Provider value={contextValue}>{children}</ApiDataContext.Provider>
}

export { ApiDataContext, ApiDataProvider }
