import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode} from 'react'
import { getCategories } from '../api/mis-gastos'

const ApiDataContext = createContext<ApiDataContextValue>({
  isFetching: false
})

type ApiDataContextValue = {
  isFetching: boolean,
  categories?: Api.Category[]
}

type ApiDataProviderProps = {
  children: ReactNode
}

function ApiDataProvider({ children }: ApiDataProviderProps) {

  const query = useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity })

  const contextValue: ApiDataContextValue = {
    isFetching: query.isFetching,
    categories: query.data
  }
  
  console.log('Rendering ApiDataProvider')

  return <ApiDataContext.Provider value={contextValue}>{children}</ApiDataContext.Provider>
}

export { ApiDataContext, ApiDataProvider }
