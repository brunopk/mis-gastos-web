import { Dayjs } from 'dayjs'
import { useCallback, useEffect, useReducer } from 'react'
import { useLoaderData } from 'react-router-dom'
import * as MisGastosUtils from '../api/mis-gastos/utils'
import * as Utils from '../utils'

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
      initial: {
        categories: [],
        subcategories: [],
        groups: [],
        accounts: []
      },
      last: {
        categories: [],
        subcategories: [],
        groups: [],
        accounts: []
      }
    }
  },
  maps: {
    categories: new Map<number, Api.ListItem>(),
    subcategories: new Map<number, Api.Subcategory>()
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
    initial: {
      startDate: null,
      finalDate: null,
      categoryIds: [],
      subcategoryIds: [],
      groupIds: [],
      accountIds: []
    },
    last: {
      startDate: null,
      finalDate: null,
      categoryIds: [],
      subcategoryIds: [],
      groupIds: [],
      accountIds: []
    }
  }
}

interface SelectItemAction {
  type: 'SELECT_CATEGORIES' | 'SELECT_SUBCATEGORIES' | 'SELECT_GROUPS' | 'SELECT_ACCOUNTS'
  data: {
    ids: number[]
  }
}

interface SetDateAction {
  type: 'SET_START_DATE' | 'SET_FINAL_DATE'
  data: {
    date: Dayjs
  }
}

interface ToggleAction {
  type: 'TOGGLE_CATEGORIES' | 'TOGGLE_SUBCATEGORIES' | 'TOGGLE_GROUPS' | 'TOGGLE_ACCOUNTS'
}

interface ResetFiltersAction {
  type: 'RESET_FILTERS'
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
  error: string | null
  isError: boolean
  isOpen: {
    categories: boolean
    subcategories: boolean
    groups: boolean
    accounts: boolean
  }
  maps: {
    categories: Map<number, Api.ListItem>
    subcategories: Map<number, Api.Subcategory>
  }
  lists: {
    original: {
      categories: ExtendedCategory[]
      subcategories: ExtendedSubcategory[][]
      groups: ExtendedGroup[][]
      accounts: ExtendedAccount[]
    }
    filtered: {
      initial: {
        categories: ListItem[]
        subcategories: ListItem[][]
        groups: ListItem[][]
        accounts: ListItem[]
      }
      last: {
        categories: ListItem[]
        subcategories: ListItem[][]
        groups: ListItem[][]
        accounts: ListItem[]
      }
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
    initial: {
      startDate: Dayjs | null
      finalDate: Dayjs | null
      categoryIds: number[]
      subcategoryIds: number[]
      groupIds: number[]
      accountIds: number[]
    }
    last: {
      startDate: Dayjs | null
      finalDate: Dayjs | null
      categoryIds: number[]
      subcategoryIds: number[]
      groupIds: number[]
      accountIds: number[]
    }
  }
}

interface ListItem {
  id: number
  name: string
  checked: boolean
  parentId?: number
}

type Action =
  | ResetFiltersAction
  | ToggleAction
  | SelectItemAction
  | SetDateAction
  | InitializeAction

type ListItemInternal = ListItem & { visible: boolean }

type ExtendedCategory = Api.ListItem & ListItemInternal

type ExtendedSubcategory = Api.Subcategory & ListItemInternal

type ExtendedGroup = Api.Group & ListItemInternal

type ExtendedAccount = Api.ListItem & ListItemInternal

function getNames(list: ListItem[], ids: unknown) {
  const strings = (ids as number[]).map((id) => list.find((item) => item.id == id)!.name)
  return strings.join(', ')
}

function getParentName(list: ListItem[], parentId: number) {
  return list.find((item) => item.id == parentId)!.name
}

function sortFunction(itemA: Api.ListItem, itemB: Api.ListItem) {
  return itemA.name.localeCompare(itemB.name)
}

function useSpendFilters({ filters }: UI.Hooks.UseSpendFilters.Params) {
  const apiLists = useLoaderData()

  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'INITIALIZE': {
        let visibleAccountIds = new Set()

        const accountIds = new Set(action.data.lists.accounts.map((account) => account.id))

        const startDate = action.data.filters.startDate

        const finalDate = action.data.filters.finalDate

        const categoriesMap = MisGastosUtils.buildCategoriesMap(action.data.lists.categories)
        const selectedCategoriesIds = action.data.filters.categoryIds
          ? action.data.filters.categoryIds
          : action.data.lists.categories.map((category) => category.id)
        const categories = action.data.lists.categories
          .map((category) => {
            if (typeof category.accountIds == 'undefined') visibleAccountIds = accountIds
            else if (visibleAccountIds.size != accountIds.size) {
              const associatedAccountIds = MisGastosUtils.getCategoryAccounts(
                category,
                action.data.lists.accounts
              )
              visibleAccountIds = Utils.union(visibleAccountIds, associatedAccountIds)
            }
            return {
              ...category,
              checked: selectedCategoriesIds.includes(category.id),
              visible: true
            }
          })
          .sort(sortFunction)

        // Mark as checked all subcategories that are associated to selected categories

        const selectedSubcategoriesIds = action.data.filters.subcategoryIds
          ? action.data.filters.subcategoryIds
          : action.data.lists.subcategories.map((subcategory) => subcategory.id)
        const subcategories: ExtendedSubcategory[][] = categories.map((category) =>
          action.data.lists.subcategories
            .filter((subcategory) => subcategory.categoryId == category.id)
            .map((subcategory) => {
              const checked = selectedSubcategoriesIds.includes(subcategory.id)
              const visible = checked || category.checked
              if (visibleAccountIds.size != accountIds.size)
                if (typeof subcategory.accountIds == 'undefined') visibleAccountIds = accountIds
                else if (visibleAccountIds.size != accountIds.size) {
                  const associatedAccountIds = MisGastosUtils.getSubcategoryAccounts(
                    subcategory,
                    action.data.lists.accounts,
                    categoriesMap
                  )
                  visibleAccountIds = Utils.union(visibleAccountIds, associatedAccountIds)
                }
              return { ...subcategory, checked, visible, parentId: category.id }
            })
            .sort(sortFunction)
        )
        const subcategoriesPlainList = subcategories.flatMap((subcategories) =>
          subcategories.flat()
        )
        const filteredSubcategories = subcategories
          .map((subcategories) => subcategories.filter((subcategory) => subcategory.visible))
          .filter((subcategories) => subcategories.length > 0)

        // Mark as checked all groups that are associated to selected subcategories
        const subcategoriesMap = MisGastosUtils.buildSubcategoriesMap(
          action.data.lists.subcategories
        )
        const selectedGroupsIds = action.data.filters.groupIds
          ? action.data.filters.groupIds
          : action.data.lists.groups.map((group) => group.id)
        const groups = subcategoriesPlainList.map((subcategory) =>
          action.data.lists.groups
            .filter((group) => group.subcategoryId == subcategory.id)
            .map((group) => {
              const checked = selectedGroupsIds.includes(group.id)
              const visible = checked || subcategory.checked
              if (visibleAccountIds.size != accountIds.size)
                if (typeof group.accountIds == 'undefined') visibleAccountIds = accountIds
                else if (visibleAccountIds.size != accountIds.size) {
                  const associatedAccountIds = MisGastosUtils.getGroupAccounts(
                    group,
                    accounts,
                    subcategoriesMap,
                    categoriesMap
                  )
                  visibleAccountIds = Utils.union(visibleAccountIds, associatedAccountIds)
                }
              return { ...group, checked, visible, parentId: subcategory.id }
            })
            .sort(sortFunction)
        )
        const groupsPlainList = groups.flatMap((groups) => groups.flat())
        const filteredGroups = groups
          .map((groups) => groups.filter((group) => group.visible))
          .filter((groups) => groups.length > 0)

        // Mark as checked  all accounts that are associated to selected categories, subcategories and groups
        const selectedAccountsIds = action.data.filters.accountIds
          ? action.data.filters.accountIds
          : action.data.lists.accounts.map((account) => account.id)
        const accounts = action.data.lists.accounts.map((account) => ({
          ...account,
          checked: selectedAccountsIds.includes(account.id),
          visible: visibleAccountIds.has(account.id)
        }))
        const filteredAccounts = accounts.filter((account) => account.visible).sort(sortFunction)

        return {
          ...prevState,
          maps: {
            categories: categoriesMap,
            subcategories: subcategoriesMap
          },
          lists: {
            original: {
              categories,
              subcategories,
              groups,
              accounts
            },
            filtered: {
              initial: {
                categories: Utils.deepCopyArray(categories),
                subcategories: Utils.deepCopyNestedArray(filteredSubcategories),
                groups: Utils.deepCopyNestedArray(filteredGroups),
                accounts: Utils.deepCopyArray(filteredAccounts)
              },
              last: {
                categories,
                subcategories: filteredSubcategories,
                groups: filteredGroups,
                accounts: filteredAccounts
              }
            }
          },
          selection: {
            initial: {
              startDate,
              finalDate,
              categoryIds: selectedCategoriesIds,
              subcategoryIds: selectedSubcategoriesIds,
              groupIds: selectedGroupsIds,
              accountIds: selectedAccountsIds
            },
            last: {
              startDate,
              finalDate,
              categoryIds: selectedCategoriesIds,
              subcategoryIds: selectedSubcategoriesIds,
              groupIds: selectedGroupsIds,
              accountIds: selectedAccountsIds
            }
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

      case 'RESET_FILTERS': {
        return {
          ...prevState,
          lists: {
            ...prevState.lists,
            filtered: {
              ...prevState.lists.filtered,
              last: {
                ...prevState.lists.filtered.initial
              }
            }
          },
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.initial
            }
          }
        }
      }

      case 'SET_START_DATE': {
        const isError = action.data.date.isAfter(prevState.selection.last.finalDate)
        const error = isError ? 'Start date cannot be after final date' : null
        const startDate = !isError ? action.data.date : prevState.selection.last.startDate

        return {
          ...prevState,
          isError,
          error,
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.last,
              startDate
            }
          }
        }
      }

      case 'SET_FINAL_DATE': {
        const isError = action.data.date.isBefore(prevState.selection.last.startDate)
        const error = isError ? 'Final date cannot be before start date' : null
        const finalDate = !isError ? action.data.date : prevState.selection.last.finalDate

        return {
          ...prevState,
          isError,
          error,
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.last,
              finalDate
            }
          }
        }
      }

      case 'SELECT_CATEGORIES': {
        const accounts = prevState.lists.original.accounts

        let accountsIdsToAdd = new Set<number>()
        let accountsIdsToUncheck1 = new Set<number>()
        let accountsIdsToUncheck2 = new Set<number>()

        const selectedCategoriesIds = new Set(action.data.ids)
        const prevSelectedCategoriesIds = new Set(prevState.selection.last.categoryIds)

        const newSelectedCategoriesIds = Utils.difference(
          selectedCategoriesIds,
          prevSelectedCategoriesIds
        )

        const uncheckedCategoriesIds = Utils.difference(
          prevSelectedCategoriesIds,
          selectedCategoriesIds
        )

        if (newSelectedCategoriesIds.size > 0 && uncheckedCategoriesIds.size > 0)
          throw new Error(
            'newSelectedCategoriesIds and uncheckedCategoriesIds cannot be both empty'
          )
        if (newSelectedCategoriesIds.size > 1 || uncheckedCategoriesIds.size > 1)
          throw new Error(
            'newSelectedCategoriesIds and uncheckedCategoriesIds cannot have both more than one entries'
          )

        prevState.lists.original.categories.forEach((category) => {
          const accountIds = MisGastosUtils.getCategoryAccounts(category, accounts)
          const isChecked = newSelectedCategoriesIds.has(category.id)
          const isUnchecked = uncheckedCategoriesIds.has(category.id)

          if (isChecked) accountsIdsToAdd = Utils.union(accountsIdsToAdd, accountIds)

          if (isUnchecked) accountsIdsToUncheck1 = Utils.union(accountsIdsToUncheck1, accountIds)
          else if (category.checked)
            accountsIdsToUncheck2 = Utils.union(accountsIdsToUncheck2, accountIds)

          category.checked = (category.checked && !isUnchecked) || isChecked
        })
        prevState.lists.filtered.last.categories.forEach(
          (category) => (category.checked = selectedCategoriesIds.has(category.id))
        )

        const accountsIdsToUncheck = Utils.difference(accountsIdsToUncheck1, accountsIdsToUncheck2)

        if (accountsIdsToAdd.size > 0 && accountsIdsToUncheck.size > 0)
          throw new Error('accountsIdsToAdd and accountsIdsToUncheck cannot be both non-empty')

        // Mark as checked  all subcategories that are associated to selected categories

        const selectedSubcategoriesIds = new Set<number>()
        const newSelectedSubcategoriesIds = new Set()

        prevState.lists.original.subcategories.forEach((subcategories) =>
          subcategories.forEach((subcategory) => {
            const isParentChecked = newSelectedCategoriesIds.has(subcategory.categoryId)
            if (isParentChecked) newSelectedSubcategoriesIds.add(subcategory.id)

            subcategory.visible = selectedCategoriesIds.has(subcategory.categoryId)
            subcategory.checked = subcategory.visible && (subcategory.checked || isParentChecked)

            if (subcategory.checked) selectedSubcategoriesIds.add(subcategory.id)
          })
        )

        const filteredSubcategories = prevState.lists.original.subcategories
          .map((subcategories) => subcategories.filter((subcategory) => subcategory.visible))
          .filter((subcategories) => subcategories.length > 0)

        // Mark as checked all groups that are associated to selected subcategories

        const selectedGroupsIds = new Set<number>()

        prevState.lists.original.groups.forEach((groups) =>
          groups.forEach((group) => {
            const isParentChecked = newSelectedSubcategoriesIds.has(group.id)

            group.visible = selectedSubcategoriesIds.has(group.subcategoryId)
            group.checked = group.visible && (group.checked || isParentChecked)

            if (group.checked) selectedGroupsIds.add(group.id)
          })
        )
        const filteredGroups = prevState.lists.original.groups
          .map((groups) => groups.filter((group) => group.visible))
          .filter((groups) => groups.length > 0)

        // Mark as checked all accounts based on selected categories, subcategories and groups.
        // If it is the case that there are accounts to remove (because some category was removed) and
        // intersection (see intersection constant below) is not empty, it's because there are some
        // accounts that are associated to subcategories and not related to the recently removed category

        const filteredAccounts: ListItem[] = []
        const selectedAccountIds = new Set<number>()
        prevState.lists.original.accounts.forEach((account) => {
          const isUnchecked = accountsIdsToUncheck.has(account.id)
          if (isUnchecked) {
            account.visible = false
            account.checked = false
          } else {
            const isChecked = accountsIdsToAdd.has(account.id)

            account.visible = true
            account.checked = account.checked || isChecked

            filteredAccounts.push({ ...account })
            if (account.checked || isChecked) selectedAccountIds.add(account.id)
          }
        })

        return {
          ...prevState,
          lists: {
            ...prevState.lists,
            filtered: {
              ...prevState.lists.filtered,
              last: {
                ...prevState.lists.filtered.last,
                subcategories: filteredSubcategories,
                groups: filteredGroups,
                accounts: filteredAccounts
              }
            }
          },
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.last,
              categoryIds: [...selectedCategoriesIds],
              subcategoryIds: [...selectedSubcategoriesIds],
              groupIds: [...selectedGroupsIds],
              accountIds: [...selectedAccountIds]
            }
          }
        }
      }

      case 'SELECT_SUBCATEGORIES': {
        const accounts = prevState.lists.original.accounts

        let accountsIdsToAdd = new Set<number>()
        let accountsIdsToUncheck1 = new Set<number>()
        let accountsIdsToUncheck2 = new Set<number>()

        const selectedSubcategoriesIds = new Set(action.data.ids)
        const prevSelectedSubcategoriesIds = new Set(prevState.selection.last.subcategoryIds)

        const newSelectedSubcategoriesIds = Utils.difference(
          selectedSubcategoriesIds,
          prevSelectedSubcategoriesIds
        )

        const uncheckedSubcategoriesIds = Utils.difference(
          prevSelectedSubcategoriesIds,
          selectedSubcategoriesIds
        )

        if (newSelectedSubcategoriesIds.size > 0 && uncheckedSubcategoriesIds.size > 0)
          throw new Error(
            'newSelectedSubcategoriesIds and uncheckedSubcategoriesIds cannot be both empty'
          )
        if (newSelectedSubcategoriesIds.size > 1 || uncheckedSubcategoriesIds.size > 1)
          throw new Error(
            'newSelectedSubcategoriesIds and uncheckedSubcategoriesIds cannot have both more than one entries'
          )

        prevState.lists.original.subcategories.forEach((subcategories) => {
          subcategories.forEach((subcategory) => {
            const accountIds = MisGastosUtils.getSubcategoryAccounts(
              subcategory,
              accounts,
              prevState.maps.categories
            )

            const isChecked = newSelectedSubcategoriesIds.has(subcategory.id)
            const isUnchecked = uncheckedSubcategoriesIds.has(subcategory.id)

            if (isChecked) accountsIdsToAdd = Utils.union(accountsIdsToAdd, accountIds)

            if (isUnchecked) accountsIdsToUncheck1 = Utils.union(accountsIdsToUncheck1, accountIds)
            else if (subcategory.checked)
              accountsIdsToUncheck2 = Utils.union(accountsIdsToUncheck2, accountIds)

            subcategory.checked = (subcategory.checked && !isUnchecked) || isChecked
          })
        })
        prevState.lists.filtered.last.subcategories.forEach((subcategories) =>
          subcategories.forEach(
            (subcategory) => (subcategory.checked = selectedSubcategoriesIds.has(subcategory.id))
          )
        )

        const accountsIdsToUncheck = Utils.difference(accountsIdsToUncheck1, accountsIdsToUncheck2)

        if (accountsIdsToAdd.size > 0 && accountsIdsToUncheck.size > 0)
          throw new Error('accountsIdsToAdd and accountsIdsToUncheck cannot be both non-empty')

        const filteredSubcategories = prevState.lists.original.subcategories
          .map((subcategories) => subcategories.filter((subcategory) => subcategory.visible))
          .filter((subcategories) => subcategories.length > 0)

        // Mark as checked all groups that are associated to selected subcategories

        const selectedGroupsIds = new Set<number>()

        prevState.lists.original.groups.forEach((groups) =>
          groups.forEach((group) => {
            const isParentChecked = newSelectedSubcategoriesIds.has(group.subcategoryId)

            group.visible = selectedSubcategoriesIds.has(group.subcategoryId)
            group.checked = group.visible && (group.checked || isParentChecked)

            if (group.checked) selectedGroupsIds.add(group.id)
          })
        )

        const filteredGroups = prevState.lists.original.groups
          .map((groups) => groups.filter((group) => group.visible))
          .filter((groups) => groups.length > 0)

        // Mark as checked all accounts based on selected subcategories and groups.
        // If it is the case that there are accounts to remove (because some subcategory was removed) and
        // intersection (intersection constant below) is not empty, it's because there are some
        // accounts that are associated to groups not related to the recently removed subcategory

        const filteredAccounts: ListItem[] = []
        const selectedAccountIds = new Set<number>()
        prevState.lists.original.accounts.forEach((account) => {
          const isUnchecked = accountsIdsToUncheck.has(account.id)
          if (isUnchecked) {
            account.visible = false
            account.checked = false
          } else {
            const isChecked = accountsIdsToAdd.has(account.id)

            account.visible = true
            account.checked = account.checked || isChecked

            filteredAccounts.push({ ...account })
            if (account.checked || isChecked) selectedAccountIds.add(account.id)
          }
        })

        return {
          ...prevState,
          lists: {
            ...prevState.lists,
            filtered: {
              ...prevState.lists.filtered,
              last: {
                ...prevState.lists.filtered.last,
                subcategories: filteredSubcategories,
                groups: filteredGroups,
                accounts: filteredAccounts
              }
            }
          },
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.last,
              subcategoryIds: [...selectedSubcategoriesIds],
              groupIds: [...selectedGroupsIds],
              accountIds: [...selectedAccountIds]
            }
          }
        }
      }

      case 'SELECT_GROUPS': {
        const accounts = prevState.lists.original.accounts

        let accountsIdsToAdd = new Set<number>()
        let accountsIdsToUncheck1 = new Set<number>()
        let accountsIdsToUncheck2 = new Set<number>()

        const selectedGroupsIds = new Set(action.data.ids)
        const prevSelectedGroupsIds = new Set(prevState.selection.last.groupIds)

        const newSelectedGroupsIds = Utils.difference(selectedGroupsIds, prevSelectedGroupsIds)

        const uncheckedGroupsIds = Utils.difference(prevSelectedGroupsIds, selectedGroupsIds)

        if (newSelectedGroupsIds.size > 0 && uncheckedGroupsIds.size > 0)
          throw new Error('newSelectedGroupsIds and uncheckedGroupsIds cannot be both empty')
        if (newSelectedGroupsIds.size > 1 || uncheckedGroupsIds.size > 1)
          throw new Error(
            'newSelectedGroupsIds and uncheckedGroupsIds cannot have both more than one entries'
          )

        prevState.lists.original.groups.forEach((groups) => {
          groups.forEach((group) => {
            const accountIds = MisGastosUtils.getGroupAccounts(
              group,
              accounts,
              prevState.maps.subcategories,
              prevState.maps.categories
            )
            const isChecked = newSelectedGroupsIds.has(group.id)
            const isUnchecked = uncheckedGroupsIds.has(group.id)

            if (isChecked) accountsIdsToAdd = Utils.union(accountsIdsToAdd, accountIds)

            if (isUnchecked) accountsIdsToUncheck1 = Utils.union(accountsIdsToUncheck1, accountIds)
            else if (group.checked)
              accountsIdsToUncheck2 = Utils.union(accountsIdsToUncheck2, accountIds)

            group.checked = (group.checked && !isUnchecked) || isChecked
          })
        })
        prevState.lists.filtered.last.groups.forEach((groups) =>
          groups.forEach((group) => (group.checked = selectedGroupsIds.has(group.id)))
        )

        const accountsIdsToUncheck = Utils.difference(accountsIdsToUncheck1, accountsIdsToUncheck2)

        if (accountsIdsToAdd.size > 0 && accountsIdsToUncheck.size > 0)
          throw new Error('accountsIdsToAdd and accountsIdsToUncheck cannot be both non-empty')

        const filteredGroups = prevState.lists.original.groups
          .map((groups) => groups.filter((group) => group.visible))
          .filter((groups) => groups.length > 0)

        // Mark as checked all accounts based on selected groups.
        // If it is the case that there are accounts to remove (because some group was removed) and
        // intersection (intersection constant below) is not empty, it's because there are some
        // accounts that are associated to other groups different to the recently removed group and the
        // recently removed group itself.

        const filteredAccounts: ListItem[] = []
        const selectedAccountIds = new Set<number>()
        prevState.lists.original.accounts.forEach((account) => {
          const isUnchecked = accountsIdsToUncheck.has(account.id)
          if (isUnchecked) {
            account.visible = false
            account.checked = false
          } else {
            const isChecked = accountsIdsToAdd.has(account.id)

            account.visible = true
            account.checked = account.checked || isChecked

            filteredAccounts.push({ ...account })
            if (account.checked || isChecked) selectedAccountIds.add(account.id)
          }
        })

        return {
          ...prevState,
          lists: {
            ...prevState.lists,
            filtered: {
              ...prevState.lists.filtered,
              last: {
                ...prevState.lists.filtered.last,
                groups: filteredGroups,
                accounts: filteredAccounts
              }
            }
          },
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.last,
              groupIds: [...selectedGroupsIds],
              accountIds: [...selectedAccountIds]
            }
          }
        }
      }

      case 'SELECT_ACCOUNTS': {
        const selectedAccounts = action.data.ids
        prevState.lists.original.accounts.forEach(
          (account) => (account.checked = selectedAccounts.includes(account.id))
        )
        prevState.lists.filtered.last.accounts.forEach(
          (account) => (account.checked = selectedAccounts.includes(account.id))
        )

        return {
          ...prevState,
          selection: {
            ...prevState.selection,
            last: {
              ...prevState.selection.last,
              accountIds: selectedAccounts
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

  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), [dispatch])

  const setStartDate = useCallback(
    (date: Dayjs) => dispatch({ type: 'SET_START_DATE', data: { date } }),
    [dispatch]
  )

  const setFinalDate = useCallback(
    (date: Dayjs) => dispatch({ type: 'SET_FINAL_DATE', data: { date } }),
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

  const toggleCategories = useCallback(() => {
    if (state.lists.filtered.last.categories.length > 0) dispatch({ type: 'TOGGLE_CATEGORIES' })
  }, [dispatch, state.lists.filtered.last.categories.length])

  const toggleSubcategories = useCallback(() => {
    if (state.lists.filtered.last.subcategories.length > 0)
      dispatch({ type: 'TOGGLE_SUBCATEGORIES' })
  }, [dispatch, state.lists.filtered.last.subcategories.length])

  const toggleGroups = useCallback(() => {
    if (state.lists.filtered.last.groups.length > 0) dispatch({ type: 'TOGGLE_GROUPS' })
  }, [dispatch, state.lists.filtered.last.groups.length])

  const toggleAccounts = useCallback(() => {
    if (state.lists.filtered.last.accounts.length > 0) dispatch({ type: 'TOGGLE_ACCOUNTS' })
  }, [dispatch, state.lists.filtered.last.accounts.length])

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
    selection: { ...state.selection.last },
    lists: { ...state.lists.filtered.last },
    functions: {
      resetFilters,
      startDate: {
        set: setStartDate
      },
      finalDate: {
        set: setFinalDate
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
