import { createContext, ReactElement, useCallback, useState } from 'react'

const SnackBarContext = createContext<SnackBarProviderValue>({
  pushSnackBarMessage: () => {
    throw new Error('pushSnackBarMessage not initialized correctly')
  }
})

type SnackBarProviderValue = {
  currentSnackBarMessage?: UI.SnackBarMessage
  pushSnackBarMessage: (msg: UI.SnackBarMessage) => void
}

type SnackBarProviderProps = {
  children: ReactElement
}

function SnackBarProvider({ children }: SnackBarProviderProps) {
  const [currentSnackBarMessage, setCurrentSnackBarMessage] = useState<UI.SnackBarMessage>()

  const pushSnackBarMessage = useCallback((msg: UI.SnackBarMessage) => {
    setCurrentSnackBarMessage(msg)
  }, [])

  const contextValue: SnackBarProviderValue = { currentSnackBarMessage, pushSnackBarMessage }

  return <SnackBarContext.Provider value={contextValue}>{children}</SnackBarContext.Provider>
}

export { SnackBarContext, SnackBarProvider }
