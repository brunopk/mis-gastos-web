import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'
import { MisGastosUtils } from '../api/mis-gastos'
import * as constants from '../constants'
import { toDate } from '../utils'

const INITIAL_STATE: State = {
  isWarning: false,
  isValidated: false,
  warning: null,
  lists: {
    original: {
      categories: [],
      subcategories: [],
      groups: [],
      accounts: []
    },
    filtered: {
      categories: [],
      subcategories: [],
      groups: [],
      accounts: []
    }
  },
  values: {
    date: null,
    category: null,
    subcategory: null,
    group: null,
    account: null,
    description: null,
    value: null
  }
}

interface SelectListItemAction {
  type: 'SELECT_CATEGORY' | 'SELECT_SUBCATEGORY' | 'SELECT_GROUP' | 'SELECT_ACCOUNT'
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
      categories: Api.ListItem[]
      subcategories: Api.Subcategory[]
      groups: Api.Group[]
      accounts: Api.ListItem[]
    }
    defaultValues: {
      categoryId: number | null
      subcategoryId: number | null
      groupId: number | null
      accountId: number | null
    }
  }
}

interface State {
  isWarning: boolean
  isValidated: boolean
  warning: string | null
  lists: {
    original: {
      categories: Api.ListItem[]
      subcategories: Api.Subcategory[]
      groups: Api.Group[]
      accounts: Api.ListItem[]
    }
    filtered: {
      categories: Api.ListItem[]
      subcategories: Api.Subcategory[]
      groups: Api.Group[]
      accounts: Api.ListItem[]
    }
  }
  values: {
    date: Dayjs | null
    category: Api.ListItem | null
    subcategory: Api.Subcategory | null
    group: Api.Group | null
    account: Api.ListItem | null
    value: number | null
    description: string | null
  }
}

type Action =
  | SetDateAction
  | SetDescriptionAction
  | SetValueAction
  | SelectListItemAction
  | ValidateAction
  | InitializeAction

export function useSpendCreation({
  defaultCategoryId,
  defaultSubcategoryId,
  defaultGroupId,
  defaultAccountId
}: UI.Hooks.UseSpendCreation.Params) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const selectedCategory = action.data.defaultValues.categoryId
          ? MisGastosUtils.findCategory(
              action.data.defaultValues.categoryId,
              action.data.lists.categories
            )
          : action.data.lists.categories[0]

        const filteredSubcategories = action.data.lists.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory.id)
          .sort((subcategoryA, subcategoryB) => subcategoryA.name.localeCompare(subcategoryB.name))
          .concat([constants.UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = action.data.defaultValues.subcategoryId
          ? MisGastosUtils.findSubcategory(
              action.data.defaultValues.subcategoryId,
              action.data.lists.subcategories
            )
          : filteredSubcategories[0]

        const filteredGroups = action.data.lists.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((groupA, groupB) => groupA.name.localeCompare(groupB.name))
          .concat([constants.UNDEFINED_GROUP])
        const selectedGroup = action.data.defaultValues.groupId
          ? MisGastosUtils.findGroup(action.data.defaultValues.groupId, action.data.lists.groups)
          : filteredGroups[0]

        const filteredAccounts = MisGastosUtils.filterAccounts(
          action.data.lists.accounts,
          [selectedCategory],
          [selectedSubcategory],
          [selectedGroup]
        ).sort((accountA, accountB) => accountA.name.localeCompare(accountB.name))
        const selectedAccount = action.data.defaultValues.accountId
          ? MisGastosUtils.findAccount(
              action.data.defaultValues.accountId,
              action.data.lists.accounts
            )
          : filteredAccounts[0]

        return {
          isWarning: false,
          isValidated: false,
          warning: null,
          lists: {
            original: { ...action.data.lists },
            filtered: {
              categories: action.data.lists.categories.slice(0),
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          values: {
            date: toDate(dayjs()),
            category: selectedCategory,
            subcategory: selectedSubcategory,
            group: selectedGroup,
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
      case 'SELECT_CATEGORY': {
        const selectedCategory = MisGastosUtils.findCategory(
          action.data.id,
          prevState.lists.filtered.categories
        )

        const filteredSubcategories = prevState.lists.original.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory.id)
          .sort((subcategoryA, subcategoryB) => subcategoryA.name.localeCompare(subcategoryB.name))
          .concat([constants.UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = filteredSubcategories[0]

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((groupA, groupB) => groupA.name.localeCompare(groupB.name))
          .concat([constants.UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0]

        const filteredAccounts = MisGastosUtils.filterAccounts(
          prevState.lists.original.accounts,
          [selectedCategory],
          [selectedSubcategory],
          [selectedGroup]
        ).sort((accountA, accountB) => accountA.name.localeCompare(accountB.name))
        const selectedAccount = filteredAccounts[0]

        return {
          ...prevState,
          isValidated: false,
          lists: {
            ...prevState.lists,
            filtered: {
              ...prevState.lists.filtered,
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          values: {
            ...prevState.values,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }
      case 'SELECT_SUBCATEGORY': {
        const selectedSubcategory = MisGastosUtils.findSubcategory(
          action.data.id,
          prevState.lists.filtered.subcategories
        )

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((groupA, groupB) => groupA.name.localeCompare(groupB.name))
          .concat([constants.UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0]

        const filteredAccounts = MisGastosUtils.filterAccounts(
          prevState.lists.original.accounts,
          [prevState.values.category!],
          [selectedSubcategory],
          [selectedGroup]
        ).sort((accountA, accountB) => accountA.name.localeCompare(accountB.name))
        const selectedAccount = filteredAccounts[0]

        return {
          ...prevState,
          isValidated: false,
          lists: {
            original: prevState.lists.original,
            filtered: {
              ...prevState.lists.filtered,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          values: {
            ...prevState.values,
            subcategory: selectedSubcategory,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }
      case 'SELECT_GROUP': {
        const selectedGroup = MisGastosUtils.findGroup(
          action.data.id,
          prevState.lists.filtered.groups
        )

        const filteredAccounts = MisGastosUtils.filterAccounts(
          prevState.lists.original.accounts,
          [prevState.values.category!],
          [prevState.values.subcategory!],
          [selectedGroup]
        ).sort((accountA, accountB) => accountA.name.localeCompare(accountB.name))
        const selectedAccount = filteredAccounts[0]

        return {
          ...prevState,
          isValidated: false,
          lists: {
            original: prevState.lists.original,
            filtered: {
              ...prevState.lists.filtered,
              accounts: filteredAccounts
            }
          },
          values: {
            ...prevState.values,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }
      case 'SELECT_ACCOUNT': {
        const selectedAccount = MisGastosUtils.findAccount(
          action.data.id,
          prevState.lists.filtered.accounts
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

  const selectCategory = useCallback(
    (id: number) => dispatch({ type: 'SELECT_CATEGORY', data: { id } }),
    [dispatch]
  )

  const selectSubcategory = useCallback(
    (id: number) => dispatch({ type: 'SELECT_SUBCATEGORY', data: { id } }),
    [dispatch]
  )

  const selectGroup = useCallback(
    (id: number) => dispatch({ type: 'SELECT_GROUP', data: { id } }),
    [dispatch]
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
          lists: apiLists,
          defaultValues: {
            categoryId: defaultCategoryId,
            subcategoryId: defaultSubcategoryId,
            groupId: defaultGroupId,
            accountId: defaultAccountId
          }
        }
      }),
    [apiLists, defaultCategoryId, defaultSubcategoryId, defaultGroupId, defaultAccountId]
  )

  const validate = useCallback(() => dispatch({ type: 'VALIDATE' }), [])

  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      data: {
        lists: apiLists,
        defaultValues: {
          categoryId: defaultCategoryId,
          subcategoryId: defaultSubcategoryId,
          groupId: defaultGroupId,
          accountId: defaultAccountId
        }
      }
    })
  }, [apiLists, defaultCategoryId, defaultSubcategoryId, defaultGroupId, defaultAccountId])

  return {
    isWarning: state.isWarning,
    isValidated: state.isValidated,
    warning: state.warning,
    lists: { ...state.lists.filtered },
    values: { ...state.values },
    functions: {
      reset,
      validate,
      setDate,
      setDescription,
      setValue,
      selectCategory,
      selectSubcategory,
      selectGroup,
      selectAccount
    }
  }
}
