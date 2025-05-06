import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'

// TODO: filter accounts by category/subcategory/group

// TODO: disable toggle if list length is 0

const INITIAL_STATE: State = {
  isError: false,
  isOpen: {
    categories: false,
    subcategories: false,
    groups: false,
    accounts: false
  },
  error: null,
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
    startDate: null,
    finalDate: null,
    categoryIds: [],
    subcategoryIds: [],
    groupIds: [],
    accountIds: []
  }
}

const sortFunction = (itemA: Api.ListItem, itemB: Api.ListItem) =>
  itemA.name.localeCompare(itemB.name)

interface SelectItemAction {
  type: 'SELECT_CATEGORIES' | 'SELECT_SUBCATEGORIES' | 'SELECT_GROUPS' | 'SELECT_ACCOUNTS'
  data: {
    ids: number[]
  }
}

interface SelectDateAction {
  type: 'SELECT_START_DATE' | 'SELECT_FINAL_DATE'
  data: {
    date: Dayjs
  }
}

interface ToggleAction {
  type: 'TOGGLE_CATEGORIES' | 'TOGGLE_SUBCATEGORIES' | 'TOGGLE_GROUPS' | 'TOGGLE_ACCOUNTS'
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
    filters: {
      startDate: Dayjs
      finalDate: Dayjs
      categoryIds: number[] | null
      subcategoryIds: number[] | null
      groupIds: number[] | null
      accountIds: number[] | null
    }
  }
}

interface State {
  error: string | null,
  isError: boolean,
  isOpen: {
    categories: boolean
    subcategories: boolean
    groups: boolean
    accounts: boolean
  },
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
    startDate: Dayjs | null
    finalDate: Dayjs | null
    categoryIds: number[]
    subcategoryIds: number[]
    groupIds: number[]
    accountIds: number[]
  }
}

type Action = ToggleAction | SelectItemAction | SelectDateAction | InitializeAction

interface Item {
  id: number
  name: string
  checked: boolean
  visible: boolean
  parentId?: number
}

type ExtendedCategory = Api.ListItem & Item

type ExtendedSubcategory = Api.Subcategory & Item

type ExtendedGroup = Api.Group & Item

type ExtendedAccount = Api.ListItem & Item

function getNames(list: Item[], ids: unknown) {
  const strings = (ids as number[]).map((id) => list.find((item) => item.id == id)!.name)
  return strings.join(', ')
}

function getParentName(list: Item[], parentId: number) {
  return list.find((item) => item.id == parentId)!.name
}

function useSpendFilters({ filters }: UI.Hooks.UseSpendFilters.Params) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        const selectedStartDate = action.data.filters.startDate

        const selectedFinalDate = action.data.filters.finalDate

        const selectedCategories = action.data.filters.categoryIds
          ? action.data.filters.categoryIds
          : action.data.lists.categories.map((category) => category.id)
        const categories = action.data.lists.categories
          .map((category) => ({
            ...category,
            checked: selectedCategories.includes(category.id),
            visible: true
          }))
          .sort(sortFunction)

        const selectedSubcategories = action.data.filters.subcategoryIds
          ? action.data.filters.subcategoryIds
          : action.data.lists.subcategories.map((subcategory) => subcategory.id)
        const subcategories: ExtendedSubcategory[][] = categories.map((category) =>
          action.data.lists.subcategories
            .filter((subcategory) => subcategory.categoryId == category.id)
            .map((subcategory) => {
              const checked = selectedSubcategories.includes(subcategory.id)
              const visible = checked || category.checked
              return { ...subcategory, checked, visible, parentId: category.id }
            })
            .sort(sortFunction)
        )
        const subcategoriesPlainList = subcategories.flatMap((subList) => subList.flat())
        const filteredSubcategories = subcategories
          .map((subList) => subList.filter((subcategory) => subcategory.visible))
          .filter((subList) => subList.length > 0)

        const selectedGroups = action.data.filters.groupIds
          ? action.data.filters.groupIds
          : action.data.lists.groups.map((group) => group.id)
        const groups = subcategoriesPlainList.map((subcategory) =>
          action.data.lists.groups
            .filter((group) => group.subcategoryId == subcategory.id)
            .map((group) => {
              const checked = selectedGroups.includes(group.id)
              const visible = checked || subcategory.checked
              return { ...group, checked, visible, parentId: subcategory.id }
            })
            .sort(sortFunction)
        )
        const groupsPlainList = groups.flatMap((subList) => subList.flat())
        const filteredGroups = groups
          .map((subList) => subList.filter((group) => group.visible))
          .filter((subList) => subList.length > 0)

        const selectedAccounts = action.data.filters.accountIds
          ? action.data.filters.accountIds
          : action.data.lists.accounts.map((account) => account.id)
        const accounts = action.data.lists.accounts
          .map((account) => ({
            ...account,
            checked: selectedAccounts.includes(account.id),
            visible: true
          }))
          .sort(sortFunction)

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
              subcategories: filteredSubcategories,
              groups: filteredGroups,
              accounts
            }
          },
          selection: {
            startDate: selectedStartDate,
            finalDate: selectedFinalDate,
            categoryIds: selectedCategories,
            subcategoryIds: selectedSubcategories,
            groupIds: selectedGroups,
            accountIds: selectedAccounts
          },
          functions: {
            categories: {
              getNames: (ids: unknown) => getNames(categories, ids)
            },
            subcategories: {
              getNames: (ids: unknown) => getNames(subcategoriesPlainList, ids),
              getParentName: (parentId: number) => getParentName(categories, parentId)
            },
            groups: {
              getNames: (ids: unknown) => getNames(groupsPlainList, ids),
              getParentName: (parentId: number) => getParentName(subcategoriesPlainList, parentId)
            },
            accounts: {
              getNames: (ids: unknown) => getNames(accounts, ids)
            }
          }
        }
      }

      case 'SELECT_START_DATE': {
        const isError = action.data.date.isAfter(prevState.selection.finalDate)
        const error = isError ? 'Start date cannot be after final date' : null
        const startDate = !isError ? action.data.date : prevState.selection.startDate
        
        return {
          ...prevState,
          isError,
          error,
          selection: {
            ...prevState.selection,
            startDate
          }
        }
      }

      case 'SELECT_FINAL_DATE': {
        const isError = action.data.date.isBefore(prevState.selection.startDate)
        const error = isError ? 'Final date cannot be before start date' : null
        const finalDate = !isError ? action.data.date : prevState.selection.finalDate
        
        return {
          ...prevState,
          isError,
          error,
          selection: {
            ...prevState.selection,
            finalDate
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

        // Select all subcategories that are children of selected categories
        const selectedSubcategories: number[] = []
        prevState.lists.original.subcategories.forEach((subList) =>
          subList.forEach((subcategory) => {
            subcategory.checked = selectedCategories.includes(subcategory.categoryId)
            subcategory.visible = subcategory.checked
            if (subcategory.checked) selectedSubcategories.push(subcategory.id)
          })
        )
        const filteredSubcategories = prevState.lists.original.subcategories
          .map((subList) => subList.filter((subcategory) => subcategory.visible))
          .filter((subList) => subList.length > 0)

        // Select all groups that are children of selected subcategories
        const selectedGroups: number[] = []
        prevState.lists.original.groups.forEach((subList) =>
          subList.forEach((group) => {
            group.checked = selectedSubcategories.includes(group.subcategoryId)
            group.visible = group.checked
            if (group.checked) selectedGroups.push(group.id)
          })
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
            ...prevState.selection,
            categoryIds: selectedCategories,
            subcategoryIds: selectedSubcategories,
            groupIds: selectedGroups
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

        // Select all groups that are children of selected subcategories
        const selectedGroups: number[] = []
        prevState.lists.original.groups.forEach((subList) =>
          subList.forEach((group) => {
            group.checked = selectedSubcategories.includes(group.subcategoryId)
            group.visible = group.checked
            if (group.checked) selectedGroups.push(group.id)
          })
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
            ...prevState.selection,
            subcategoryIds: selectedSubcategories,
            groupIds: selectedGroups
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
            ...prevState.selection,
            groupIds: selectedGroups
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
            ...prevState.selection,
            accountIds: selectedAccounts
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

  const selectStartDate = useCallback(
    (date: Dayjs) => dispatch({ type: 'SELECT_START_DATE', data: { date } }),
    [dispatch]
  )

  const selectFinalDate = useCallback(
    (date: Dayjs) => dispatch({ type: 'SELECT_FINAL_DATE', data: { date } }),
    [dispatch]
  )

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
      data: { lists: apiLists, filters }
    })
  }, [apiLists, filters])

  return {
    isOpen: { ...state.isOpen },
    isError: state.isError,
    error: state.error,
    selection: { ...state.selection },
    lists: { ...state.lists.filtered },
    functions: {
      startDate: {
        select: selectStartDate
      },
      finalDate: {
        select: selectFinalDate
      },
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

export default useSpendFilters
