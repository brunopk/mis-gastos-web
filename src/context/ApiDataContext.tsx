import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode, useEffect } from 'react'
import { getCategories, ApiError } from '../api/mis-gastos'
import useSnackBar from '../hooks/useSnackBar'

const ApiDataContext = createContext<ApiDataContextValue>({
  isFetching: false
})

type ApiDataContextValue = {
  isFetching: boolean
  categories?: Api.Category[]
}

type ApiDataProviderProps = {
  children: ReactNode
}

function ApiDataProvider({ children }: ApiDataProviderProps) {
  const { pushSnackBarMessage } = useSnackBar()
  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
    retry: 2
  })

  const contextValue: ApiDataContextValue = {
    isFetching,
    categories: data
  }

  useEffect(() => {
    if (isError) {
      const severity: UI.SnackBarSeverity = (error as ApiError).statusCode < 500 ? 'warning' : 'error'
      pushSnackBarMessage({text: `${error.name} ${error.message}`, severity })
    }
  }, [isError, error, pushSnackBarMessage])

  return <ApiDataContext.Provider value={contextValue}>{children}</ApiDataContext.Provider>
}

export { ApiDataContext, ApiDataProvider }
