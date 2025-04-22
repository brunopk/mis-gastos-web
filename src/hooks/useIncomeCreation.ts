import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

const INITIAL_STATE: State = {
  lists: {
    original: {
      incomeSources: [],
      accounts: []
    },
    filtered: {
      accounts: []
    }
  },
  selection: {
    incomeSource: {
      id: null
    },
    account: {
      id: null
    }
  }
}

type SelectAction = {
  type: 'SELECT_INCOME_SOURCE' | 'SELECT_ACCOUNT'
  data: {
    id: number
  }
}

type InitializeAction = {
  type: 'INITIALIZE'
  data: {
    incomeSources: Api.ListItem[]
    accounts: Api.Account[]
  }
}

interface State {
  lists: {
    original: {
      incomeSources: Api.ListItem[]
      accounts: Api.Account[]
    }
    filtered: {
      accounts: Api.Account[]
    }
  }
  selection: {
    incomeSource: {
      id: number | null
    }
    account: {
      id: number | null
    }
  }
}

type Action = SelectAction | InitializeAction

export default function useIncomeCreation(defaultIncomeSourceId?: number) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        let initialIncomeSources = action.data.incomeSources
        if (typeof defaultIncomeSourceId != 'undefined')
          initialIncomeSources = action.data.incomeSources.filter(
            (incomeSource) => incomeSource.id == defaultIncomeSourceId
          )
        const selectedIncomeSource = initialIncomeSources[0]

        let filteredAccounts = action.data.accounts.filter(
          (account) =>
            typeof selectedIncomeSource.accountIds != 'undefined' &&
            selectedIncomeSource.accountIds.includes(account.id)
        )
        if (filteredAccounts.length == 0) filteredAccounts = action.data.accounts.slice(0)
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: {
              incomeSources: initialIncomeSources,
              accounts: action.data.accounts
            },
            filtered: {
              accounts: filteredAccounts
            }
          },
          selection: {
            incomeSource: {
              id: selectedIncomeSource.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      // Income source selection is not allowed when typeof defaultIncomeSourceId == 'undefined'
      case 'SELECT_INCOME_SOURCE': {
        const selectedIncomeSourceId = action.data.id
        const selectedIncomeSource = prevState.lists.original.incomeSources.find(
          (incomeSource) => incomeSource.id == selectedIncomeSourceId
        )

        let filteredAccounts = prevState.lists.original.accounts.filter(
          (account) =>
            typeof selectedIncomeSource!.accountIds != 'undefined' &&
            selectedIncomeSource!.accountIds.includes(account.id)
        )
        if (filteredAccounts.length == 0)
          filteredAccounts = prevState.lists.original.accounts.slice(0)
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: prevState.lists.original,
            filtered: {
              accounts: filteredAccounts
            }
          },
          selection: {
            incomeSource: {
              id: selectedIncomeSource!.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      case 'SELECT_ACCOUNT': {
        const selectedAccount = action.data.id

        return {
          ...prevState,
          selection: {
            ...prevState.selection,
            account: {
              id: selectedAccount
            }
          }
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const selectIncomeSource = useCallback(
    (id: number) => {
      if (typeof defaultIncomeSourceId != 'undefined')
        throw new Error(
          `Income source selection is not allowed when typeof defaultIncomeSourceId != 'undefined', 
            invoke useIncomeCreation without arguments to enable income source selection`
        )
      dispatch({ type: 'SELECT_INCOME_SOURCE', data: { id } })
    },
    [dispatch, defaultIncomeSourceId]
  )

  const selectAccount = useCallback(
    (id: number) => dispatch({ type: 'SELECT_ACCOUNT', data: { id } }),
    [dispatch]
  )

  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      data: apiLists
    })
  }, [apiLists])

  return {
    selection: { ...state.selection },
    lists: {
      incomeSources: state.lists.original.incomeSources,
      accounts: state.lists.filtered.accounts
    },
    functions: {
      selectIncomeSource,
      selectAccount
    }
  }
}
