import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

const INITIAL_STATE: State = {
  lists: {
    original: {
      incomeTypes: [],
      accounts: []
    },
    filtered: {
      accounts: []
    }
  },
  selection: {
    incomeType: {
      id: null
    },
    account: {
      id: null
    }
  }
}

type SelectAction = {
  type: 'SELECT_INCOME_TYPE' | 'SELECT_ACCOUNT'
  data: {
    id: number
  }
}

type InitializeAction = {
  type: 'INITIALIZE'
  data: {
    incomeTypes: Api.ListItem[]
    accounts: Api.Account[]
  }
}

interface State {
  lists: {
    original: {
      incomeTypes: Api.ListItem[]
      accounts: Api.Account[]
    }
    filtered: {
      accounts: Api.Account[]
    }
  }
  selection: {
    incomeType: {
      id: number | null
    }
    account: {
      id: number | null
    }
  }
}

type Action = SelectAction | InitializeAction

export default function useIncomeCreation(defaultIncomeTypeId?: number) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        let initialIncomeTypes = action.data.incomeTypes
        if (typeof defaultIncomeTypeId != 'undefined')
          initialIncomeTypes = action.data.incomeTypes.filter(
            (incomeType) => incomeType.id == defaultIncomeTypeId
          )
        const selectedIncomeType = initialIncomeTypes[0]

        let filteredAccounts = action.data.accounts.filter(
          (account) =>
            typeof selectedIncomeType.accountIds != 'undefined' &&
            selectedIncomeType.accountIds.includes(account.id)
        )
        if (filteredAccounts.length == 0) filteredAccounts = action.data.accounts.slice(0)
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: {
              incomeTypes: initialIncomeTypes,
              accounts: action.data.accounts
            },
            filtered: {
              accounts: filteredAccounts
            }
          },
          selection: {
            incomeType: {
              id: selectedIncomeType.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      // Income source selection is not allowed when typeof defaultIncomeTypeId == 'undefined'
      case 'SELECT_INCOME_TYPE': {
        const selectedIncomeTypeId = action.data.id
        const selectedIncomeType = prevState.lists.original.incomeTypes.find(
          (incomeType) => incomeType.id == selectedIncomeTypeId
        )

        let filteredAccounts = prevState.lists.original.accounts.filter(
          (account) =>
            typeof selectedIncomeType!.accountIds != 'undefined' &&
            selectedIncomeType!.accountIds.includes(account.id)
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
            incomeType: {
              id: selectedIncomeType!.id
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

  const selectIncomeType = useCallback(
    (id: number) => {
      if (typeof defaultIncomeTypeId != 'undefined')
        throw new Error(
          `Income source selection is not allowed when typeof defaultIncomeTypeId != 'undefined', 
            invoke useIncomeCreation without arguments to enable income source selection`
        )
      dispatch({ type: 'SELECT_INCOME_TYPE', data: { id } })
    },
    [dispatch, defaultIncomeTypeId]
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
      incomeTypes: state.lists.original.incomeTypes,
      accounts: state.lists.filtered.accounts
    },
    functions: {
      selectIncomeType,
      selectAccount
    }
  }
}
