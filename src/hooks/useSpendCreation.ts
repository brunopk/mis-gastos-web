import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'
import * as api from '../api/mis-gastos'

// TODO: use interfaces instead of type (when possible)

const UNDEFINED_SUBCATEGORY: Api.Subcategory = {
  id: -1,
  name: 'Sin definir',
  categoryId: -1,
  accountIds: []
}

const UNDEFINED_GROUP: Api.Group = {
  id: -1,
  name: 'Sin definir',
  subcategoryId: -1,
  accountIds: []
}

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
    category: {
      id: null
    },
    subcategory: {
      id: null
    },
    group: {
      id: null
    },
    account: {
      id: null
    }
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
    categories: Api.Category[]
    subcategories: Api.Subcategory[]
    groups: Api.Group[]
    accounts: Api.Account[]
  }
}

type State = {
  lists: {
    original: {
      categories: Api.Category[]
      subcategories: Api.Subcategory[]
      groups: Api.Group[]
      accounts: Api.Account[]
    }
    filtered: {
      categories: Api.Category[]
      subcategories: Api.Subcategory[]
      groups: Api.Group[]
      accounts: Api.Account[]
    }
  }
  selection: {
    category: {
      id: number | null
    }
    subcategory: {
      id: number | null
    }
    group: {
      id: number | null
    }
    account: {
      id: number | null
    }
  }
}

type Action = SelectAction | InitializeAction

function filterAccounts(
  accounts: Api.ListItem[],
  selectedCategory?: Api.Category,
  selectedSubcategory?: Api.Subcategory,
  selectedGroup?: Api.Group
): Api.ListItem[] {
  const originalList = accounts.slice(0)
  
  let filteredAccounts = originalList.filter(
    (account) =>
      typeof selectedCategory?.accountIds != 'undefined' &&
    selectedCategory.accountIds.includes(account.id)
  )
  
  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : originalList
  filteredAccounts = filteredAccounts.filter(
    (account) =>
      typeof selectedSubcategory?.accountIds != 'undefined' &&
    selectedSubcategory.accountIds.includes(account.id)
  )

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : originalList
  filteredAccounts = filteredAccounts.filter(
    (account) =>
      typeof selectedGroup?.accountIds != 'undefined' &&
    selectedGroup.accountIds.includes(account.id)
  )

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : originalList
  return filteredAccounts.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
}

export const constants = {
  UNDEFINED_SUBCATEGORY,
  UNDEFINED_GROUP
}

export function useSpendCreation() {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const selectedCategory = action.data.categories[0]

        const filteredSubcategories = action.data.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = filteredSubcategories[0]

        const filteredGroups = action.data.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0]

        const filteredAccounts = filterAccounts(
          action.data.accounts,
          selectedCategory,
          selectedSubcategory,
          selectedGroup
        )
        const selectedAccount = filteredAccounts[0]

        return {
          lists: {
            original: { ...action.data },
            filtered: {
              categories: action.data.categories.slice(0),
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts: filteredAccounts
            }
          },
          selection: {
            category: {
              id: selectedCategory.id
            },
            subcategory: {
              id: selectedSubcategory.id
            },
            group: {
              id: selectedGroup.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      case 'SELECT_CATEGORY': {
        const selectedCategory = api.utils.findCategory(action.data.id, prevState.lists.filtered.categories)

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
          prevState.lists.filtered.accounts,
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
            category: {
              id: selectedCategory.id
            },
            subcategory: {
              id: selectedSubcategory.id
            },
            group: {
              id: selectedGroup.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      case 'SELECT_SUBCATEGORY': {
        const selectedSubcategory = api.utils.findSubcategory(action.data.id, prevState.lists.filtered.subcategories)

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory.id)
          .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0]

        const filteredAccounts = filterAccounts(
          prevState.lists.filtered.accounts,
          undefined,
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
            subcategory: {
              id: selectedSubcategory.id
            },
            group: {
              id: selectedGroup.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      case 'SELECT_GROUP': {
        const selectedGroup = api.utils.findGroup(action.data.id, prevState.lists.filtered.groups)

        const filteredAccounts = filterAccounts(
          prevState.lists.filtered.accounts,
          undefined,
          undefined,
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
            group: {
              id: selectedGroup.id
            },
            account: {
              id: selectedAccount.id
            }
          }
        }
      }

      case 'SELECT_ACCOUNT': {
        const selectedAccount = api.utils.findAccount(action.data.id, prevState.lists.filtered.accounts)

        return {
          ...prevState,
          selection: {
            ...prevState.selection,
            account: {
              id: selectedAccount.id
            }
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
      data: apiLists
    })
  }, [apiLists])

  return {
    selection: { ...state.selection },
    lists: { ...state.lists.filtered, accounts: state.lists.original.accounts },
    functions: {
      selectCategory,
      selectSubcategory,
      selectGroup,
      selectAccount
    }
  }
}
