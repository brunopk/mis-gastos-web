import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'
import {REIMBURSEMENT} from '../constants'

const INITIAL_STATE: State = {
  isError: false,
  error: null,
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
    date: null,
    incomeTypeId: null,
    accountId: null
  }
}

type SelectItemAction = {
  type: 'SELECT_INCOME_TYPE' | 'SELECT_ACCOUNT'
  data: {
    id: number
  }
}

interface SelectDateAction {
  type: 'SELECT_DATE'
  data: {
    date: Dayjs
  }
}

type InitializeAction = {
  type: 'INITIALIZE'
  data: {
    incomeTypes: Api.ListItem[]
    accounts: Api.ListItem[]
  }
}

interface State {
  isError: boolean
  error: string | null
  lists: {
    original: {
      incomeTypes: Api.ListItem[]
      accounts: Api.ListItem[]
    }
    filtered: {
      accounts: Api.ListItem[]
    }
  }
  selection: {
    date: Dayjs | null
    incomeTypeId: number | null
    accountId: number | null
  }
}

type Action = SelectItemAction | SelectDateAction | InitializeAction

export default function useIncomeCreation({
  defaultIncomeTypeId
}: UI.Hooks.UseIncomeCreation.Params) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const selectedDate = dayjs()

        let initialIncomeTypes = action.data.incomeTypes
        if (typeof defaultIncomeTypeId != 'undefined')
          initialIncomeTypes = action.data.incomeTypes.filter(
            (incomeType) => incomeType.id == defaultIncomeTypeId
          )
        else 
          initialIncomeTypes = action.data.incomeTypes.filter(
            (incomeType) => incomeType.id != REIMBURSEMENT
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
          ...prevState,
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
            date: selectedDate,
            incomeTypeId: selectedIncomeType.id,
            accountId: selectedAccount.id
          }
        }
      }

      case 'SELECT_DATE': {
        const isError = dayjs().isBefore(prevState.selection.date)
        const error = isError ? 'Date cannot be in the future' : null
        const date = !isError ? action.data.date : prevState.selection.date

        return {
          ...prevState,
          isError,
          error,
          selection: {
            ...prevState.selection,
            date
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
          ...prevState,
          lists: {
            ...prevState.lists,
            filtered: {
              accounts: filteredAccounts
            }
          },
          selection: {
            ...prevState.selection,
            incomeTypeId: selectedIncomeType!.id,
            accountId: selectedAccount.id
          }
        }
      }

      case 'SELECT_ACCOUNT': {
        const selectedAccount = action.data.id

        return {
          ...prevState,
          selection: {
            ...prevState.selection,
            accountId: selectedAccount
          }
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const selectDate = useCallback(
    (date: Dayjs) => dispatch({ type: 'SELECT_DATE', data: { date } }),
    [dispatch]
  )

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
      data: { ...apiLists }
    })
  }, [apiLists])

  return {
    isError: state.isError,
    error: state.error,
    selection: { ...state.selection },
    lists: {
      incomeTypes: state.lists.original.incomeTypes,
      accounts: state.lists.filtered.accounts
    },
    functions: {
      selectDate,
      selectIncomeType,
      selectAccount
    }
  }
}
