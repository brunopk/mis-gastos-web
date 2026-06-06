import { QueryClient } from '@tanstack/react-query'
import * as api from './api'
import type {
  ApiCategoriesMap,
  ApiGroup,
  ApiListItem,
  ApiSubcategoriesMap,
  ApiSubcategory
} from './types'
import { LoaderFunction } from 'react-router-dom'

export function buildCategoriesMap(categories: ApiListItem[]): ApiCategoriesMap {
  const result = new Map<number, ApiListItem>()
  categories.forEach((category) => result.set(category.id, category))
  return result
}

export function buildSubcategoriesMap(subcategories: ApiSubcategory[]): ApiSubcategoriesMap {
  const result = new Map<number, ApiSubcategory>()
  subcategories.forEach((subcategory) => result.set(subcategory.id, subcategory))
  return result
}

export function findAccount(accountId: number, accounts: ApiListItem[]): ApiListItem {
  const account = accounts.find((account) => account.id == accountId)
  if (typeof account == 'undefined') throw new Error(`Account ${accountId} not found`)
  return account
}

export function findCategory(categoryId: number, categories: ApiListItem[]): ApiListItem {
  const category = categories.find((category) => category.id == categoryId)
  if (typeof category == 'undefined') throw new Error(`Category ${categoryId} not found`)
  return category
}

export function findGroup(groupId: number, groups: ApiGroup[]): ApiGroup {
  const group = groups.find((group) => group.id == groupId)
  if (typeof group == 'undefined') throw new Error(`Group ${groupId} not found`)
  return group
}

export function findIncomeType(incomeTypeId: number, incomeTypes: ApiListItem[]): ApiListItem {
  const incomeType = incomeTypes.find((incomeType) => incomeType.id == incomeTypeId)
  if (typeof incomeType == 'undefined') throw new Error(`Income type ${incomeTypeId} not found`)
  return incomeType
}

export function findParentCategory(
  subcategory: ApiSubcategory,
  categoriesMap: ApiCategoriesMap
): ApiListItem {
  const result = categoriesMap.get(subcategory.categoryId)
  if (typeof result == 'undefined')
    throw new Error(`Parent category of '${subcategory.name}' not found.`)
  return result
}

export function findParentSubcategory(
  group: ApiGroup,
  subcategoriesMap: ApiSubcategoriesMap
): ApiSubcategory {
  const result = subcategoriesMap.get(group.subcategoryId)
  if (typeof result == 'undefined')
    throw new Error(`Parent subcategory of '${group.name}' not found.`)
  return result
}

export function findSubcategory(
  subcategoryId: number,
  subcategories: ApiSubcategory[]
): ApiSubcategory {
  const subcategory = subcategories.find((subcategory) => subcategory.id == subcategoryId)
  if (typeof subcategory == 'undefined') throw new Error(`Subcategory ${subcategoryId} not found`)
  return subcategory
}

export function flatAccountIds(list: ApiListItem[]): number[] {
  return [
    ...new Set(
      list.flatMap((item) => (typeof item.accountIds != 'undefined' ? item.accountIds : []))
    )
  ]
}

export function getCategoryAccounts(category: ApiListItem, accounts: ApiListItem[]): Set<number> {
  if (typeof category.accountIds != 'undefined' && category.accountIds.length > 0)
    return new Set(category.accountIds)

  return new Set(accounts.map((account) => account.id))
}

export function getGroupAccounts(
  group: ApiGroup,
  accounts: ApiListItem[],
  subcategoriesMap: ApiSubcategoriesMap,
  categoriesMap: ApiCategoriesMap
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
  subcategory: ApiSubcategory,
  accounts: ApiListItem[],
  categoriesMap: ApiCategoriesMap
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
