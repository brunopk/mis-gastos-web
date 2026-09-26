import { createContext, ReactElement, useState } from 'react'

const UserContext = createContext<UserProviderValue>({
  loginInformation: {
    isAuthenticated: false
  },
  setLoginInformation: () => {
    throw new Error('setLoginInformation function not initialized')
  }
})

interface UserProviderValue {
  loginInformation: LoginInformation
  setLoginInformation: React.Dispatch<React.SetStateAction<LoginInformation>>
}

interface LoginInformation {
  isAuthenticated: boolean
}

interface UserProviderProps {
  children: ReactElement[]
}

// TODO: CONTINUE This endpoint should call API to check if the user is authenticated.

/**
   const { mutate: authCallback } = useMutation({
     mutationFn: Api.authCallback,
     onSuccess: () => {
       setLoginInformation({ isAuthenticated: true })
       navigate(constants.PATHS.SPENDS.INDEX + constants.PATHS.SPENDS.NEW)
     },
     onError: (error) => {
       if (error instanceof Api.ApiError && error.statusCode < 500) {
         setResult({ isError: true, severity: 'warning', message: error.message })
       } else {
         setResult({ isError: true, severity: 'error', message: error.message })
       }
     }
   })
 */

function UserProvider({ children }: UserProviderProps) {
  const [loginInformation, setLoginInformation] = useState<LoginInformation>({
    isAuthenticated: false,
  })

  const contextValue: UserProviderValue = { loginInformation, setLoginInformation }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
