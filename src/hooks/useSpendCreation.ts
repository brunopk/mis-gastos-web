import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

// TODO: filter accounts by category/subcategory/group

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
      groups: []
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

export const constants = {
  UNDEFINED_SUBCATEGORY,
  UNDEFINED_GROUP
}

export function useSpendCreation() {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const selectedCategory = action.data.categories[0].id

        const filteredSubcategories = action.data.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory)
          .concat([UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = filteredSubcategories[0].id

        const filteredGroups = action.data.groups
          .filter((group) => group.subcategoryId == selectedSubcategory)
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0].id

        const selectedAccount = action.data.accounts[0].id

        return {
          lists: {
            original: { ...action.data },
            filtered: {
              categories: action.data.categories,
              subcategories: filteredSubcategories,
              groups: filteredGroups
            }
          },
          selection: {
            category: {
              id: selectedCategory
            },
            subcategory: {
              id: selectedSubcategory
            },
            group: {
              id: selectedGroup
            },
            account: {
              id: selectedAccount
            }
          }
        }
      }

      case 'SELECT_CATEGORY': {
        const selectedCategory = action.data.id

        const filteredSubcategories = prevState.lists.original.subcategories
          .filter((subcategory) => subcategory.categoryId == selectedCategory)
          .concat([UNDEFINED_SUBCATEGORY])
        const selectedSubcategory = filteredSubcategories[0].id

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory)
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0].id

        const selectedAccount = prevState.lists.original.accounts[0].id

        return {
          lists: {
            original: prevState.lists.original,
            filtered: {
              categories: prevState.lists.original.categories,
              subcategories: filteredSubcategories,
              groups: filteredGroups
            }
          },
          selection: {
            category: {
              id: selectedCategory
            },
            subcategory: {
              id: selectedSubcategory
            },
            group: {
              id: selectedGroup
            },
            account: {
              id: selectedAccount
            }
          }
        }
      }

      case 'SELECT_SUBCATEGORY': {
        const selectedSubcategory = action.data.id

        const filteredGroups = prevState.lists.original.groups
          .filter((group) => group.subcategoryId == selectedSubcategory)
          .concat([UNDEFINED_GROUP])
        const selectedGroup = filteredGroups[0].id

        return {
          lists: {
            original: prevState.lists.original,
            filtered: {
              categories: prevState.lists.filtered.categories,
              subcategories: prevState.lists.filtered.subcategories,
              groups: filteredGroups
            }
          },
          selection: {
            ...prevState.selection,
            subcategory: {
              id: selectedSubcategory
            },
            group: {
              id: selectedGroup
            }
          }
        }
      }

      case 'SELECT_GROUP': {
        const selectedGroup = action.data.id

        return {
          ...prevState,
          selection: {
            ...prevState.selection,
            group: {
              id: selectedGroup
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
