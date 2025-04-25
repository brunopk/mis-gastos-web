import { QueryClient } from '@tanstack/react-query'
import { LoaderFunction } from 'react-router-dom'
import * as ApiQuery from './mis-gastos'

export const apiListLoader: (queryClient: QueryClient) => LoaderFunction =
  (queryClient) => async () => {
    const queryCommonAttributes = {
      staleTime: Infinity,
      retry: 2
    }

    const categoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['categories'],
      queryFn: ApiQuery.getCategories
    })

    const subcategoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['subcategories'],
      queryFn: ApiQuery.getSubcategories
    })

    const groupsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['groups'],
      queryFn: ApiQuery.getGroups
    })

    const accountsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['accounts'],
      queryFn: ApiQuery.getAccounts
    })

    const incomeTypesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['income-types'],
      queryFn: ApiQuery.getIncomeTypes
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

export function findCategoryName(categoryId: number, categories: Api.Category[]): string {
  const category = categories.find((category) => category.id == categoryId)
  if (typeof category == 'undefined')
    throw new Error(`Category ${categoryId} not found`)
  return category.name
}

export function findSubcategoryName(subcategoryId: number, subcategories: Api.Subcategory[]): string {
  const subcategory = subcategories.find((subcategory) => subcategory.id == subcategoryId)
  if (typeof subcategory == 'undefined')
    throw new Error(`Subcategory ${subcategoryId} not found`)
  return subcategory.name
}

export function findGroupName(groupId: number, groups: Api.Group[]): string {
  const group = groups.find((group) => group.id == groupId)
  if (typeof group == 'undefined')
    throw new Error(`Group ${groupId} not found`)
  return group.name
}

export function findAccountName(accountId: number, accounts: Api.Account[]): string {
  const account = accounts.find((account) => account.id == accountId)
  if (typeof account == 'undefined')
    throw new Error(`Account ${accountId} not found`)
  return account.name
}