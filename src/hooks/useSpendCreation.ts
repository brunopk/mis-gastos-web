import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'
import * as api from '../api/mis-gastos'
import { UNDEFINED_GROUP, UNDEFINED_SUBCATEGORY } from '../constants'

// TODO: use interfaces instead of type (when possible)

const INITIAL_STATE: State = {
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
  selection: {
    category: null,
    subcategory: null,
    group: null,
    account: null
  }
}

type SelectAction = {
  type: 'SELECT_CATEGORY' | 'SELECT_SUBCATEGORY' | 'SELECT_GROUP' | 'SELECT_ACCOUNT'
  data: {
    id: number
  }
}

type InitializeAction = {
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

type State = {
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
  selection: {
    category: Api.ListItem | null
    subcategory: Api.Subcategory | null
    group: Api.Group | null
    account: Api.ListItem | null
  }
}

type Action = SelectAction | InitializeAction

// TODO: generalize to a list of categories, subcategories, etc (to allow this function to be used in ListControls )

function filterAccounts(
  accounts: Api.ListItem[],
  selectedCategory?: Api.ListItem,
  selectedSubcategory?: Api.Subcategory,
  selectedGroup?: Api.Group
): Api.ListItem[] {
  const originalList = accounts.slice(0)

  let filteredAccounts =
    typeof selectedCategory == 'undefined'
      ? originalList
      : originalList.filter(
          (account) =>
            typeof selectedCategory?.accountIds != 'undefined' &&
            selectedCategory.accountIds.includes(account.id)
        )

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : originalList
  filteredAccounts =
    typeof selectedSubcategory == 'undefined' || selectedSubcategory.id == UNDEFINED_SUBCATEGORY.id
      ? filteredAccounts
      : filteredAccounts.filter(
          (account) =>
            typeof selectedSubcategory?.accountIds != 'undefined' &&
            selectedSubcategory.accountIds.includes(account.id)
        )

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : originalList
  filteredAccounts =
    typeof selectedGroup == 'undefined' || selectedGroup.id == UNDEFINED_GROUP.id
      ? filteredAccounts
      : filteredAccounts.filter(
          (account) =>
            typeof selectedGroup?.accountIds != 'undefined' &&
            selectedGroup.accountIds.includes(account.id)
        )

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : originalList
  return filteredAccounts.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
}

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
          ? api.utils.findCategory(
              action.data.defaultValues.categoryId,
              action.data.lists.categories
            )
          : action.data.lists.categories[0]

        const filteredSubcategories = action.data.lists.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = action.data.defaultValues.subcategoryId
          ? api.utils.findSubcategory(
              action.data.defaultValues.subcategoryId,
              action.data.lists.subcategories
            )
          : filteredSubcategories[0]

        const filteredGroups = action.data.lists.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_GROUP])
        const selectedGroup = action.data.defaultValues.groupId
          ? api.utils.findGroup(action.data.defaultValues.groupId, action.data.lists.groups)
          : filteredGroups[0]

        const filteredAccounts = filterAccounts(
          action.data.lists.accounts,
          selectedCategory,
          selectedSubcategory,
          selectedGroup
        )
        const selectedAccount = action.data.defaultValues.accountId
          ? api.utils.findAccount(action.data.defaultValues.accountId, action.data.lists.accounts)
          : filteredAccounts[0]

        return {
          lists: {
            original: { ...action.data.lists },
            filtered: {
              categories: action.data.lists.categories.slice(0),
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          selection: {
            category: selectedCategory,
            subcategory: selectedSubcategory,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }

      case 'SELECT_CATEGORY': {
        const selectedCategory = api.utils.findCategory(
          action.data.id,
          prevState.lists.filtered.categories
        )

        const filteredSubcategories = prevState.lists.original.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = filteredSubcategories[0]

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0]

        const filteredAccounts = filterAccounts(
          prevState.lists.original.accounts,
          selectedCategory,
          selectedSubcategory,
          selectedGroup
        )
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: prevState.lists.original,
            filtered: {
              categories: prevState.lists.original.categories,
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          selection: {
            category: selectedCategory,
            subcategory: selectedSubcategory,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }

      case 'SELECT_SUBCATEGORY': {
        const selectedSubcategory = api.utils.findSubcategory(
          action.data.id,
          prevState.lists.filtered.subcategories
        )

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0]

        const filteredAccounts = filterAccounts(
          prevState.lists.original.accounts,
          prevState.selection.category!,
          selectedSubcategory,
          selectedGroup
        )
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: prevState.lists.original,
            filtered: {
              ...prevState.lists.filtered,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          selection: {
            ...prevState.selection,
            subcategory: selectedSubcategory,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }

      case 'SELECT_GROUP': {
        const selectedGroup = api.utils.findGroup(action.data.id, prevState.lists.filtered.groups)

        const filteredAccounts = filterAccounts(
          prevState.lists.original.accounts,
          prevState.selection.category!,
          prevState.selection.subcategory!,
          selectedGroup
        )
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: prevState.lists.original,
            filtered: {
              ...prevState.lists.filtered,
              accounts: filteredAccounts
            }
          },
          selection: {
            ...prevState.selection,
            group: selectedGroup,
            account: selectedAccount
          }
        }
      }

      case 'SELECT_ACCOUNT': {
        const selectedAccount = api.utils.findAccount(
          action.data.id,
          prevState.lists.filtered.accounts
        )

        return {
          ...prevState,
          selection: {
            ...prevState.selection,
            account: selectedAccount
          }
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

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
    lists: { ...state.lists.filtered },
    selection: { ...state.selection },
    functions: {
      selectCategory,
      selectSubcategory,
      selectGroup,
      selectAccount
    }
  }
}
