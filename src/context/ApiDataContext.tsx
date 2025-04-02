import { useQueries } from '@tanstack/react-query'
import { createContext, ReactNode, useEffect } from 'react'
import { ApiError, getAccounts, getCategories, getGroups, getSubcategories } from '../api/mis-gastos'
import useSnackBar from '../hooks/useSnackBar'

const ApiDataContext = createContext<ApiDataContextValue>({
  isFetching: false,
  categories: [],
  subcategories: [],
  groups: [],
  accounts: []
})

type ApiDataContextValue = {
  isFetching: boolean
  categories: Api.Category[],
  subcategories: Api.Subcategory[],
  groups: Api.Group[],
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
      { ...queryCommonAttributes, queryKey: ['categories'], queryFn: getCategories},
      { ...queryCommonAttributes, queryKey: ['subcategories'], queryFn: getSubcategories },
      { ...queryCommonAttributes, queryKey: ['groups'], queryFn: getGroups },
      { ...queryCommonAttributes, queryKey: ['accounts'], queryFn: getAccounts }
    ],
  })

  const isFetching = queries.filter((query) => query.isFetching).length > 0

  const isError = queries.filter((query) => query.isError).length > 0

  const error = isError ? queries.filter((query) => query.error)[0].error : null

  const contextValue: ApiDataContextValue = {
    isFetching,
    categories: queries[0].data ? queries[0].data : [],
    subcategories: queries[1].data ? queries[1].data : [],
    groups: queries[2].data ? queries[2].data : [],
    accounts: queries[3].data ? queries[3].data : []
  }

  useEffect(() => {
    if (error) {
      const severity: UI.SnackBarSeverity =
        (error as ApiError).statusCode < 500 ? 'warning' : 'error'
      pushSnackBarMessage({ text: `${error.name} ${error.message}`, severity })
    }
  }, [error, pushSnackBarMessage])

  return <ApiDataContext.Provider value={contextValue}>{children}</ApiDataContext.Provider>
}

export { ApiDataContext, ApiDataProvider }
