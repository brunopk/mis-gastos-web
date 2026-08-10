import dayjs, { Dayjs } from 'dayjs'
import type { ApiListItem } from '../api/mis-gastos/types'
import * as MisGastosUtils from '../api/mis-gastos/utils'
import * as constants from '../constants'
import { toDate } from '../utils'
import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/

interface UseIncomeCreationParams {
  defaultIncomeTypeId: number | null
  excludedIncomeTypeIds: number[]
}

interface SelectListItemAction {
  type: 'SELECT_INCOME_TYPE' | 'SELECT_ACCOUNT'
  data: {
    id: number
  }
}

interface SetDateAction {
  type: 'SET_DATE'
  data: {
    date: Dayjs
  }
}

interface SetValueAction {
  type: 'SET_VALUE'
  data: {
    value: number
  }
}

interface SetDescriptionAction {
  type: 'SET_DESCRIPTION'
  data: {
    text: string
  }
}

interface ValidateAction {
  type: 'VALIDATE'
}

interface InitializeAction {
  type: 'INITIALIZE'
  data: {
    lists: {
      incomeTypes: ApiListItem[]
      accounts: ApiListItem[]
    }
    defaultValues: {
      incomeTypeId: number | null
    }
    excludedValues: {
      incomeTypeId: number[]
    }
  }
}

interface State {
  isWarning: boolean
  isValidated: boolean
  warning: string | null
  lists: {
    original: {
      incomeTypes: ApiListItem[]
      accounts: ApiListItem[]
    }
    filtered: {
      incomeTypes: ApiListItem[]
      accounts: ApiListItem[]
    }
  }
  values: {
    date: Dayjs | null
    incomeType: ApiListItem | null
    account: ApiListItem | null
    value: number | null
    description: string | null
  }
}

/**************************************************************************************************/
/*                                              TYPES                                             */
/**************************************************************************************************/

type Action =
  | SetDateAction
  | SetDescriptionAction
  | SetValueAction
  | SelectListItemAction
  | ValidateAction
  | InitializeAction

/**************************************************************************************************/
/*                                            CONSTANTS                                           */
/**************************************************************************************************/

const INITIAL_STATE: State = {
  isWarning: false,
  isValidated: false,
  warning: null,
  lists: {
    original: {
      incomeTypes: [],
      accounts: []
    },
    filtered: {
      incomeTypes: [],
      accounts: []
    }
  },
  values: {
    date: null,
    incomeType: null,
    account: null,
    description: null,
    value: null
  }
}

/**************************************************************************************************/
/*                                           FUNCTIONS                                            */
/**************************************************************************************************/

function filterAccountsByIncomeTypes(
  accounts: ApiListItem[],
  selectedIncomeType: ApiListItem
): ApiListItem[] {
  const allAccounts = accounts.slice(0)
  let filteredAccounts = allAccounts
  const accountIds = MisGastosUtils.flatAccountIds([selectedIncomeType])
  if (accountIds.length > 0)
    filteredAccounts = filteredAccounts.filter((account) => accountIds.includes(account.id))

  return filteredAccounts.length > 0 ? filteredAccounts : allAccounts
}

/**************************************************************************************************/
/*                                              HOOK                                              */
/**************************************************************************************************/

export default function useIncomeCreation({
  defaultIncomeTypeId,
  excludedIncomeTypeIds
}: UseIncomeCreationParams) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        // If default income type is set, the list have only this income type
        let filteredIncomeTypes = action.data.defaultValues.incomeTypeId
          ? [
              MisGastosUtils.findIncomeType(
                action.data.defaultValues.incomeTypeId,
                action.data.lists.incomeTypes
              )
            ]
          : action.data.lists.incomeTypes
        filteredIncomeTypes = filteredIncomeTypes
          .filter((incomeType) => !action.data.excludedValues.incomeTypeId.includes(incomeType.id))
          .sort((incomeTypeA, incomeTypeB) => incomeTypeA.name.localeCompare(incomeTypeB.name))
        const selectedIncomeType = filteredIncomeTypes[0]

        const filteredAccounts = filterAccountsByIncomeTypes(
          action.data.lists.accounts,
          selectedIncomeType
        ).sort((accountA, accountB) => accountA.name.localeCompare(accountB.name))
        const selectedAccount = filteredAccounts[0]

        return {
          isValidated: false,
          isWarning: false,
          warning: null,
          lists: {
            original: { ...action.data.lists },
            filtered: {
              incomeTypes: filteredIncomeTypes,
              accounts: filteredAccounts
            }
          },
          values: {
            date: toDate(dayjs()),
            incomeType: selectedIncomeType,
            account: selectedAccount,
            description: null,
            value: 0
          }
        }
      }
      case 'SET_VALUE': {
        return {
          ...prevState,
          isValidated: false,
          values: {
            ...prevState.values,
            value: action.data.value
          }
        }
      }
      case 'SET_DESCRIPTION': {
        return {
          ...prevState,
          isValidated: false,
          values: {
            ...prevState.values,
            description: action.data.text
          }
        }
      }
      case 'SET_DATE': {
        return {
          ...prevState,
          isValidated: false,
          values: {
            ...prevState.values,
            date: action.data.date
          }
        }
      }
      case 'SELECT_INCOME_TYPE': {
        const selectedIncomeType = MisGastosUtils.findIncomeType(
          action.data.id,
          prevState.lists.original.incomeTypes
        )

        const filteredAccounts = filterAccountsByIncomeTypes(
          prevState.lists.original.accounts,
          selectedIncomeType
        ).sort((accountA, accountB) => accountA.name.localeCompare(accountB.name))
        const selectedAccount = filteredAccounts[0]

        return {
          ...prevState,
          isValidated: false,
          lists: {
            ...prevState.lists,
            filtered: {
              ...prevState.lists.filtered,
              accounts: filteredAccounts
            }
          },
          values: {
            ...prevState.values,
            incomeType: selectedIncomeType,
            account: selectedAccount
          }
        }
      }
      case 'SELECT_ACCOUNT': {
        const selectedAccount = MisGastosUtils.findAccount(
          action.data.id,
          prevState.lists.original.accounts
        )

        return {
          ...prevState,
          isValidated: false,
          values: {
            ...prevState.values,
            account: selectedAccount
          }
        }
      }
      case 'VALIDATE': {
        const isWarning1 = dayjs().isBefore(prevState.values.date)
        const isWarning2 =
          !prevState.values.value ||
          (typeof prevState.values.value == 'number' && prevState.values.value <= 0)
        const message = isWarning1
          ? constants.DATE_WARNING_MSG
          : isWarning2
            ? constants.VALUE_WARNING_MSG
            : null

        return {
          ...prevState,
          isWarning: isWarning1 || isWarning2,
          isValidated: true,
          warning: message
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const setDate = useCallback(
    (date: Dayjs) => dispatch({ type: 'SET_DATE', data: { date } }),
    [dispatch]
  )

  const setDescription = useCallback(
    (text: string) => dispatch({ type: 'SET_DESCRIPTION', data: { text } }),
    [dispatch]
  )

  const setValue = useCallback(
    (value: number) => dispatch({ type: 'SET_VALUE', data: { value } }),
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

  const reset = useCallback(
    () =>
      dispatch({
        type: 'INITIALIZE',
        data: {
          lists: {
            ...apiLists
          },
          defaultValues: {
            incomeTypeId: defaultIncomeTypeId
          },
          excludedValues: {
            incomeTypeId: excludedIncomeTypeIds
          }
        }
      }),
    [apiLists, defaultIncomeTypeId, excludedIncomeTypeIds]
  )

  const validate = useCallback(() => dispatch({ type: 'VALIDATE' }), [])

  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      data: {
        lists: {
          ...apiLists
        },
        defaultValues: {
          incomeTypeId: defaultIncomeTypeId
        },
        excludedValues: {
          incomeTypeId: excludedIncomeTypeIds
        }
      }
    })
  }, [apiLists, defaultIncomeTypeId, excludedIncomeTypeIds])

  return {
    isWarning: state.isWarning,
    isValidated: state.isValidated,
    warning: state.warning,
    lists: { ...state.lists.filtered },
    values: { ...state.values },
    functions: {
      setDate,
      setDescription,
      setValue,
      selectIncomeType,
      selectAccount,
      reset,
      validate
    }
  }
}

/**************************************************************************************************/
/*                                           EXPORTS                                              */
/**************************************************************************************************/

export type { UseIncomeCreationParams }
