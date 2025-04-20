import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

const INITIAL_STATE: State = {
  isOpen: {
    categories: false,
    subcategories: false,
    groups: false,
    accounts: false
  },
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
  functions: {
    categories: {
      getNames: () => {
        throw new Error('getNames not initialized')
      }
    },
    subcategories: {
      getNames: () => {
        throw new Error('getNames not initialized')
      },
      getParentName: () => {
        throw new Error('getParentName not initialized')
      }
    },
    groups: {
      getNames: () => {
        throw new Error('getNames not initialized')
      },
      getParentName: () => {
        throw new Error('getParentName not initialized')
      }
    },
    accounts: {
      getNames: () => {
        throw new Error('getNames not initialized')
      }
    }
  },
  selection: {
    category: {
      ids: []
    },
    subcategory: {
      ids: []
    },
    group: {
      ids: []
    },
    account: {
      ids: []
    }
  }
}

type SelectAction = {
  type: 'SELECT_CATEGORIES' | 'SELECT_SUBCATEGORIES' | 'SELECT_GROUPS' | 'SELECT_ACCOUNTS'
  data: {
    ids: number[]
  }
}

type ToggleAction = {
  type: 'TOGGLE_CATEGORIES' | 'TOGGLE_SUBCATEGORIES' | 'TOGGLE_GROUPS' | 'TOGGLE_ACCOUNTS'
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
  isOpen: {
    categories: boolean
    subcategories: boolean
    groups: boolean
    accounts: boolean
  }
  lists: {
    original: {
      categories: ExtendedCategory[]
      subcategories: ExtendedSubcategory[][]
      groups: ExtendedGroup[][]
      accounts: ExtendedAccount[]
    }
    filtered: {
      categories: Item[]
      subcategories: Item[][]
      groups: Item[][]
      accounts: Item[]
    }
  }
  functions: {
    categories: {
      getNames: (ids: unknown) => string
    }
    subcategories: {
      getNames: (ids: unknown) => string
      getParentName: (parentId: number) => string
    }
    groups: {
      getNames: (ids: unknown) => string
      getParentName: (parentId: number) => string
    }
    accounts: {
      getNames: (ids: unknown) => string
    }
  }
  selection: {
    category: {
      ids: number[]
    }
    subcategory: {
      ids: number[]
    }
    group: {
      ids: number[]
    }
    account: {
      ids: number[]
    }
  }
}

type Action = ToggleAction | SelectAction | InitializeAction

type Item = {
  id: number
  name: string
  checked: boolean
  visible: boolean
  parentId?: number
}

type ExtendedCategory = Api.Category & Item

type ExtendedSubcategory = Api.Subcategory & Item

type ExtendedGroup = Api.Group & Item

type ExtendedAccount = Api.Account & Item

function sortItemsByName(list: Api.ListItem[]): Api.Category[] {
  return list.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
}

function useSpendsFilters() {
  const apiLists = useLoaderData<Api.FixedLists>()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const categories: ExtendedCategory[] = sortItemsByName(action.data.categories).map(
          (category) => ({ ...category, checked: false, visible: true })
        )

        const subcategoriesAux: ExtendedSubcategory[] = sortItemsByName(
          action.data.subcategories
        ).map((subcategory) => ({
          ...(subcategory as Api.Subcategory),
          checked: false,
          visible: true,
          parentId: (subcategory as Api.Subcategory).categoryId
        }))
        const subcategories: ExtendedSubcategory[][] = categories.map((category) =>
          subcategoriesAux.filter((subcategory) => subcategory.categoryId == category.id)
        )

        const groupsAux: ExtendedGroup[] = sortItemsByName(action.data.groups).map((group) => ({
          ...(group as Api.Group),
          checked: false,
          visible: true,
          parentId: (group as Api.Group).subcategoryId
        }))
        const groups: ExtendedGroup[][] = subcategoriesAux.map((subcategory) =>
          groupsAux.filter((group) => group.subcategoryId == subcategory.id)
        )

        const accounts: ExtendedAccount[] = sortItemsByName(action.data.accounts).map(
          (account, index) => ({
            ...account,
            id: index,
            checked: false,
            visible: true,
            apiId: account.id
          })
        )

        return {
          ...prevState,
          lists: {
            original: {
              categories,
              subcategories,
              groups,
              accounts
            },
            filtered: {
              categories,
              accounts,
              subcategories,
              groups
            }
          },
          functions: {
            categories: {
              getNames: (ids: unknown) => {
                const strings = (ids as number[]).map(
                  (id) => categories.find((category) => category.id == id)!.name
                )
                return strings.join(', ')
              }
            },
            subcategories: {
              getNames: (ids: unknown) => {
                const strings = (ids as number[]).map(
                  (id) => subcategoriesAux.find((subcategory) => subcategory.id == id)!.name
                )
                return strings.join(', ')
              },
              getParentName: (parentId: number) =>
                categories.find((category) => category.id == parentId)!.name
            },
            groups: {
              getNames: (ids: unknown) => {
                const strings = (ids as number[]).map(
                  (id) => groupsAux.find((group) => group.id == id)!.name
                )
                return strings.join(', ')
              },
              getParentName: (parentId: number) =>
                groupsAux.find((group) => group.id == parentId)!.name
            },
            accounts: {
              getNames: (ids: unknown) => {
                const strings = (ids as number[]).map(
                  (id) => accounts.find((account) => account.id == id)!.name
                )
                return strings.join(', ')
              }
            }
          }
        }
      }

      case 'SELECT_CATEGORIES': {
        const selectedCategories = action.data.ids
        prevState.lists.original.categories.forEach(
          (category) => (category.checked = selectedCategories.includes(category.id))
        )
        prevState.lists.filtered.categories.forEach(
          (category) => (category.checked = selectedCategories.includes(category.id))
        )

        // Keeps previous selected subcategories
        const selectedSubcategories = prevState.selection.subcategory.ids
        prevState.lists.original.subcategories.forEach((subList) =>
          subList.forEach(
            (subcategory) =>
              (subcategory.visible =
                selectedSubcategories.includes(subcategory.id) ||
                selectedCategories.includes(subcategory.categoryId))
          )
        )
        const filteredSubcategories = prevState.lists.original.subcategories
          .map((subList) => subList.filter((subcategory) => subcategory.visible))
          .filter((subList) => subList.length > 0)

        // Keeps previous selected groups
        const selectedGroups = prevState.selection.group.ids
        prevState.lists.original.groups.forEach((subList) =>
          subList.forEach(
            (group) =>
              (group.visible =
                selectedGroups.includes(group.id) ||
                selectedSubcategories.includes(group.subcategoryId))
          )
        )
        const filteredGroups = prevState.lists.original.groups
          .map((subList) => subList.filter((group) => group.visible))
          .filter((subList) => subList.length > 0)

        return {
          ...prevState,
          lists: {
            original: prevState.lists.original,
            filtered: {
              categories: prevState.lists.filtered.categories,
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts: prevState.lists.filtered.accounts
            }
          },
          selection: {
            category: {
              ids: selectedCategories
            },
            subcategory: {
              ids: prevState.selection.subcategory.ids
            },
            group: {
              ids: prevState.selection.group.ids
            },
            account: {
              ids: prevState.selection.account.ids
            }
          }
        }
      }

      case 'SELECT_SUBCATEGORIES': {
        const selectedSubcategories = action.data.ids
        prevState.lists.original.subcategories.forEach((subList) =>
          subList.forEach(
            (subcategory) => (subcategory.checked = selectedSubcategories.includes(subcategory.id))
          )
        )
        prevState.lists.filtered.subcategories.forEach((subList) =>
          subList.forEach(
            (subcategory) => (subcategory.checked = selectedSubcategories.includes(subcategory.id))
          )
        )

        // Keeps previous selected groups
        const selectedGroups = prevState.selection.group.ids
        prevState.lists.original.groups.forEach((subList) =>
          subList.forEach(
            (group) =>
              (group.visible =
                selectedGroups.includes(group.id) ||
                selectedSubcategories.includes(group.subcategoryId))
          )
        )
        const filteredGroups = prevState.lists.original.groups
          .map((subList) => subList.filter((group) => group.visible))
          .filter((subList) => subList.length > 0)

        return {
          ...prevState,
          lists: {
            original: prevState.lists.original,
            filtered: {
              categories: prevState.lists.filtered.categories,
              subcategories: prevState.lists.filtered.subcategories,
              groups: filteredGroups,
              accounts: prevState.lists.filtered.accounts
            }
          },
          selection: {
            category: {
              ids: prevState.selection.category.ids
            },
            subcategory: {
              ids: selectedSubcategories
            },
            group: {
              ids: prevState.selection.group.ids
            },
            account: {
              ids: prevState.selection.account.ids
            }
          }
        }
      }

      case 'SELECT_GROUPS': {
        const selectedGroups = action.data.ids
        prevState.lists.original.groups.forEach((subList) =>
          subList.forEach((group) => (group.checked = selectedGroups.includes(group.id)))
        )
        prevState.lists.filtered.groups.forEach((subList) =>
          subList.forEach((group) => (group.checked = selectedGroups.includes(group.id)))
        )

        return {
          ...prevState,
          selection: {
            category: {
              ids: prevState.selection.category.ids
            },
            subcategory: {
              ids: prevState.selection.subcategory.ids
            },
            group: {
              ids: selectedGroups
            },
            account: {
              ids: prevState.selection.account.ids
            }
          }
        }
      }

      case 'SELECT_ACCOUNTS': {
        const selectedAccounts = action.data.ids
        prevState.lists.original.accounts.forEach(
          (account) => (account.checked = selectedAccounts.includes(account.id))
        )
        prevState.lists.filtered.accounts.forEach(
          (account) => (account.checked = selectedAccounts.includes(account.id))
        )

        return {
          ...prevState,
          selection: {
            category: {
              ids: prevState.selection.category.ids
            },
            subcategory: {
              ids: prevState.selection.subcategory.ids
            },
            group: {
              ids: prevState.selection.account.ids
            },
            account: {
              ids: selectedAccounts
            }
          }
        }
      }

      case 'TOGGLE_CATEGORIES': {
        return {
          ...prevState,
          isOpen: {
            categories: !prevState.isOpen.categories,
            subcategories: prevState.isOpen.subcategories,
            groups: prevState.isOpen.groups,
            accounts: prevState.isOpen.accounts
          }
        }
      }

      case 'TOGGLE_SUBCATEGORIES': {
        return {
          ...prevState,
          isOpen: {
            categories: prevState.isOpen.categories,
            subcategories: !prevState.isOpen.subcategories,
            groups: prevState.isOpen.groups,
            accounts: prevState.isOpen.accounts
          }
        }
      }

      case 'TOGGLE_GROUPS': {
        return {
          ...prevState,
          isOpen: {
            categories: prevState.isOpen.categories,
            subcategories: prevState.isOpen.subcategories,
            groups: !prevState.isOpen.groups,
            accounts: prevState.isOpen.accounts
          }
        }
      }

      case 'TOGGLE_ACCOUNTS': {
        return {
          ...prevState,
          isOpen: {
            categories: prevState.isOpen.categories,
            subcategories: prevState.isOpen.subcategories,
            groups: prevState.isOpen.groups,
            accounts: !prevState.isOpen.accounts
          }
        }
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const selectCategories = useCallback(
    (ids: number[]) => dispatch({ type: 'SELECT_CATEGORIES', data: { ids } }),
    [dispatch]
  )

  const selectSubcategories = useCallback(
    (ids: number[]) => dispatch({ type: 'SELECT_SUBCATEGORIES', data: { ids } }),
    [dispatch]
  )

  const selectGroups = useCallback(
    (ids: number[]) => dispatch({ type: 'SELECT_GROUPS', data: { ids } }),
    [dispatch]
  )

  const selectAccounts = useCallback(
    (ids: number[]) => dispatch({ type: 'SELECT_ACCOUNTS', data: { ids } }),
    [dispatch]
  )

  const toggleCategories = useCallback(() => dispatch({ type: 'TOGGLE_CATEGORIES' }), [dispatch])

  const toggleSubcategories = useCallback(
    () => dispatch({ type: 'TOGGLE_SUBCATEGORIES' }),
    [dispatch]
  )

  const toggleGroups = useCallback(() => dispatch({ type: 'TOGGLE_GROUPS' }), [dispatch])

  const toggleAccounts = useCallback(() => dispatch({ type: 'TOGGLE_ACCOUNTS' }), [dispatch])

  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      data: apiLists
    })
  }, [apiLists])

  return {
    isOpen: { ...state.isOpen },
    selection: { ...state.selection },
    lists: { ...state.lists.filtered },
    functions: {
      categories: {
        select: selectCategories,
        toggle: toggleCategories,
        getNames: state.functions.categories.getNames
      },
      subcategories: {
        select: selectSubcategories,
        toggle: toggleSubcategories,
        getParentName: state.functions.subcategories.getParentName,
        getNames: state.functions.subcategories.getNames
      },
      groups: {
        select: selectGroups,
        toggle: toggleGroups,
        getParentName: state.functions.groups.getParentName,
        getNames: state.functions.groups.getNames
      },
      accounts: {
        select: selectAccounts,
        toggle: toggleAccounts,
        getNames: state.functions.accounts.getNames
      }
    }
  }
}

export default useSpendsFilters
