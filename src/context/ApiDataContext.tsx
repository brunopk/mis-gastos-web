import { createContext, ReactNode} from 'react'

const ApiDataContext = createContext<ApiDataContextValue>({})

type ApiDataContextValue = {
  categories?: Api.Category[]
}

type ApiDataProviderProps = {
  children: ReactNode
  categories?: Api.Category[]
}

function ApiDataProvider({ children, categories }: ApiDataProviderProps) {
  const contextValue: ApiDataContextValue = {
    categories
  }
  
  console.log('Rendering ApiDataProvider')

  return <ApiDataContext.Provider value={contextValue}>{children}</ApiDataContext.Provider>
}

export { ApiDataContext, ApiDataProvider }
