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

function UserProvider({ children }: UserProviderProps) {
  const [loginInformation, setLoginInformation] = useState<LoginInformation>({
    isAuthenticated: false,
  })

  const contextValue: UserProviderValue = { loginInformation, setLoginInformation }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }
