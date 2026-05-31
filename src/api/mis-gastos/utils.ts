import { QueryClient } from '@tanstack/react-query'
import { LoaderFunction } from 'react-router-dom'
import * as api from './api'

export function buildCategoriesMap(categories: Api.ListItem[]): Api.CategoriesMap {
  const result = new Map<number, Api.ListItem>()
  categories.forEach((category) => result.set(category.id, category))
  return result
}

export function buildSubcategoriesMap(subcategories: Api.Subcategory[]): Api.SubcategoriesMap {
  const result = new Map<number, Api.Subcategory>()
  subcategories.forEach((subcategory) => result.set(subcategory.id, subcategory))
  return result
}

export function findAccount(accountId: number, accounts: Api.ListItem[]): Api.ListItem {
  const account = accounts.find((account) => account.id == accountId)
  if (typeof account == 'undefined') throw new Error(`Account ${accountId} not found`)
  return account
}

export function findCategory(categoryId: number, categories: Api.ListItem[]): Api.ListItem {
  const category = categories.find((category) => category.id == categoryId)
  if (typeof category == 'undefined') throw new Error(`Category ${categoryId} not found`)
  return category
}

export function findGroup(groupId: number, groups: Api.Group[]): Api.Group {
  const group = groups.find((group) => group.id == groupId)
  if (typeof group == 'undefined') throw new Error(`Group ${groupId} not found`)
  return group
}

export function findIncomeType(incomeTypeId: number, incomeTypes: Api.ListItem[]): Api.ListItem {
  const incomeType = incomeTypes.find((incomeType) => incomeType.id == incomeTypeId)
  if (typeof incomeType == 'undefined') throw new Error(`Income type ${incomeTypeId} not found`)
  return incomeType
}

export function findParentCategory(subcategory: Api.Subcategory, categoriesMap: Api.CategoriesMap): Api.ListItem {
  const result = categoriesMap.get(subcategory.categoryId)
  if (typeof result == 'undefined')
    throw new Error(`Parent category of '${subcategory.name}' not found.`)
  return result
}

export function findParentSubcategory(group: Api.Group, subcategoriesMap: Api.SubcategoriesMap): Api.Subcategory {
  const result = subcategoriesMap.get(group.subcategoryId)
  if (typeof result == 'undefined')
    throw new Error(`Parent subcategory of '${group.name}' not found.`)
  return result
}

export function findSubcategory(subcategoryId: number, subcategories: Api.Subcategory[]): Api.Subcategory {
  const subcategory = subcategories.find((subcategory) => subcategory.id == subcategoryId)
  if (typeof subcategory == 'undefined') throw new Error(`Subcategory ${subcategoryId} not found`)
  return subcategory
}

export function flatAccountIds(list: Api.ListItem[]): number[] {
  return [
    ...new Set(
      list.flatMap((item) => (typeof item.accountIds != 'undefined' ? item.accountIds : []))
    )
  ]
}

export function getCategoryAccounts(
  category: Api.ListItem,
  accounts: Api.ListItem[],
): Set<number> {
  if (typeof category.accountIds != 'undefined' && category.accountIds.length > 0)
    return new Set(category.accountIds)

  return new Set(accounts.map((account) => account.id))
}

export function getGroupAccounts(
  group: Api.Group,
  accounts: Api.ListItem[],
  subcategoriesMap: Api.SubcategoriesMap,
  categoriesMap: Api.CategoriesMap
): Set<number> {
  if (typeof group.accountIds != 'undefined' && group.accountIds.length > 0)
    return new Set(group.accountIds)

  const parentSubcategory = findParentSubcategory(group, subcategoriesMap)
  if (typeof parentSubcategory.accountIds == 'undefined') {
    const parentCategory = findParentCategory(parentSubcategory, categoriesMap)
    if (typeof parentCategory.accountIds == 'undefined')
      return new Set(accounts.map((account) => account.id))
    return new Set(parentCategory.accountIds)
  }
 
  return new Set(parentSubcategory.accountIds)
}

export function getSubcategoryAccounts(
  subcategory: Api.Subcategory,
  accounts: Api.ListItem[],
  categoriesMap: Api.CategoriesMap
): Set<number> {
  if (typeof subcategory.accountIds != 'undefined' && subcategory.accountIds.length > 0)
    return new Set(subcategory.accountIds)

  const parentCategory = findParentCategory(subcategory, categoriesMap)
  if (typeof parentCategory.accountIds == 'undefined')
    return new Set(accounts.map((account) => account.id))

  return new Set(parentCategory.accountIds)
}

export function loaderFunctionBuilder(queryClient: QueryClient): LoaderFunction {
  return async () => {
    // For more information about staleTime and gcTime see :
    // - https://dev.to/delisrey/react-query-staletime-vs-cachetime-hml
    // - https://www.codemzy.com/blog/react-query-cachetime-staletime
    
    const queryCommonAttributes = {
      staleTime: Infinity,
      gcTime: Infinity,
      retry: 2
    }

    const categoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['categories'],
      queryFn: api.getCategories
    })

    const subcategoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['subcategories'],
      queryFn: api.getSubcategories
    })

    const groupsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['groups'],
      queryFn: api.getGroups
    })

    const accountsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['accounts'],
      queryFn: api.getAccounts
    })

    const incomeTypesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['income-types'],
      queryFn: api.getIncomeTypes
    })

    const lists = await Promise.all([
      categoriesPromise,
      subcategoriesPromise,
      groupsPromise,
      accountsPromise,
      incomeTypesPromise
    ])

    const result = {
      categories: lists[0],
      subcategories: lists[1],
      groups: lists[2],
      accounts: lists[3],
      incomeTypes: lists[4]
    }

    return result
  }
}
