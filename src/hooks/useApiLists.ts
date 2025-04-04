import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

const INITIAL_STATE: State = {
  originalLists: {
    categories: [],
    subcategories: [],
    groups: [],
    accounts: []
  },
  filteredLists: {
    categories: [],
    subcategories: [],
    groups: []
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
  originalLists: {
    categories: Api.Category[]
    subcategories: Api.Subcategory[]
    groups: Api.Group[]
    accounts: Api.Account[]
  }
  filteredLists: {
    categories: Api.Category[]
    subcategories: Api.Subcategory[]
    groups: Api.Group[]
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


function useApiLists() {
  const apiLists = useLoaderData<Api.FixedLists>()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const selectedCategory = action.data.categories[0].id
        const filteredSubcategories = action.data.subcategories.filter(
          (subcategory) => subcategory.categoryId == selectedCategory
        )
        const selectedSubcategory =
          filteredSubcategories.length > 0 ? filteredSubcategories[0].id : null
        const filteredGroups = action.data.groups.filter(
          (group) => group.subcategoryId == selectedSubcategory
        )
        const selectedGroup = filteredGroups.length > 0 ? filteredGroups[0].id : null
        const selectedAccount = action.data.accounts[0].id
        return {
          originalLists: { ...action.data },
          filteredLists: {
            categories: action.data.categories,
            subcategories: filteredSubcategories,
            groups: filteredGroups
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
        const filteredSubcategories = prevState.originalLists.subcategories.filter(
          (subcategory) => subcategory.categoryId == selectedCategory
        )
        const selectedSubcategory =
          filteredSubcategories.length > 0 ? filteredSubcategories[0].id : null
        const filteredGroups = prevState.originalLists.groups.filter(
          (group) => group.subcategoryId == selectedSubcategory
        )
        const selectedGroup = filteredGroups.length > 0 ? filteredGroups[0].id : null
        const selectedAccount = prevState.originalLists.accounts[0].id
        return {
          ...prevState,
          filteredLists: {
            categories: prevState.originalLists.categories,
            subcategories: filteredSubcategories,
            groups: filteredGroups
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
        const filteredGroups = prevState.originalLists.groups.filter(
          (group) => group.subcategoryId == selectedSubcategory
        )
        const selectedGroup = filteredGroups.length > 0 ? filteredGroups[0].id : null
        return {
          ...prevState,
          filteredLists: {
            categories: prevState.originalLists.categories,
            subcategories: prevState.filteredLists.subcategories,
            groups: filteredGroups
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
          filteredLists: { ...prevState.filteredLists },
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
    lists: { ...state.filteredLists, accounts: state.originalLists.accounts },
    functions: {
      selectCategory,
      selectSubcategory,
      selectGroup,
      selectAccount
    }
  }
}

export default useApiLists
