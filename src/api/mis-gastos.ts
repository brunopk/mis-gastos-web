import dayjs from 'dayjs'
import { QueryClient } from '@tanstack/react-query'
import { LoaderFunction } from 'react-router-dom'
import {UNDEFINED_SUBCATEGORY, UNDEFINED_GROUP} from '../constants'

const API_MIS_GASTOS_HOST = import.meta.env.VITE_API_MIS_GASTOS_HOST

export const utils = {
  buildLoaderFunction,
  findCategory,
  findSubcategory,
  findGroup,
  findAccount,
  filterAccounts
}

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function getIncomeTypes(): Promise<Api.ListItem[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/income-types`)

  const body = await handleApiErrors(response)

  return (
    body as {
      id: number
      name: string
      account_ids: number[]
    }[]
  ).map((category) => ({
    id: category.id,
    name: category.name,
    accountIds: category.account_ids
  }))
}

export async function getCategories(): Promise<Api.ListItem[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/categories`)

  const body = await handleApiErrors(response)

  return (
    body as {
      id: number
      name: string
      account_ids: number[]
    }[]
  ).map((category) => ({
    id: category.id,
    name: category.name,
    accountIds: category.account_ids
  }))
}

export async function getSubcategories(): Promise<Api.Subcategory[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/subcategories`)

  const body = await handleApiErrors(response)

  return (body as { id: number; name: string; category_id: number; account_ids: number[] }[]).map(
    (subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      categoryId: subcategory.category_id,
      accountIds: subcategory.account_ids
    })
  )
}

export async function getGroups(): Promise<Api.Group[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/groups`)

  const body = await handleApiErrors(response)

  return (
    body as { id: number; name: string; subcategory_id: number; account_ids: number[] }[]
  ).map((group) => ({
    id: group.id,
    name: group.name,
    subcategoryId: group.subcategory_id,
    accountIds: group.account_ids
  }))
}

export async function getAccounts(): Promise<Api.ListItem[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/accounts`)

  const body = await handleApiErrors(response) as Api.ListItem[]

  return body
}

export async function getSpends(): Promise<Api.Spend[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/spends`)

  const body = await handleApiErrors(response)

  return (
    body as {
      id: number
      date: string
      category_id: number
      subcategory_id: number
      group_id: number
      account_id: number
      description?: string
      value: number
    }[]
  ).map((spend) => ({
    id: spend.id,
    date: dayjs(spend.date),
    categoryId: spend.category_id,
    subcategoryId: spend.subcategory_id,
    groupId: spend.group_id,
    accountId: spend.account_id,
    description: spend.description,
    value: spend.value
  }))
}

export async function createSpend(newSpend: Api.Spend): Promise<Api.Spend> {
  const body = (await post(`${API_MIS_GASTOS_HOST}/spends`, {
    date: newSpend.date.toISOString(),
    category_id: newSpend.categoryId,
    subcategory_id: newSpend.subcategoryId,
    group_id: newSpend.groupId,
    account_id: newSpend.accountId,
    description: newSpend.description,
    value: newSpend.value
  })) as {
    id: number
    date: string
    category_id: number
    subcategory_id: number | null
    group_id: number | null
    account_id: number
    description?: string
    value: number
  }

  return {
    id: body.id,
    date: dayjs(body.date),
    categoryId: body.category_id,
    subcategoryId: body.subcategory_id,
    groupId: body.group_id,
    accountId: body.account_id,
    description: body.description,
    value: body.value
  }
}

export async function getIncomes(): Promise<Api.Income[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/incomes`)

  const body = await handleApiErrors(response)

  return (
    body as {
      id: number
      date: string
      income_type_id: number
      account_id: number
      description: string
      value: number
      spend:
        | {
            id: number
            date: string
            category_id: number
            subcategory_id: number
            group_id: number
            account_id: number
            description?: string
            value: number
          }
        | undefined
    }[]
  ).map((income) => ({
    id: income.id,
    date: dayjs(income.date),
    incomeTypeId: income.income_type_id,
    accountId: income.account_id,
    description: income.description,
    value: income.value,
    spend: income.spend
      ? {
          id: income.spend.id,
          date: dayjs(income.spend.date),
          categoryId: income.spend.category_id,
          subcategoryId: income.spend.subcategory_id,
          groupId: income.spend.group_id,
          accountId: income.spend.account_id,
          description: income.spend.description,
          value: income.spend.value
        }
      : null
  }))
}

export async function getAutocompleteOptionsForSpendDescription(
  query: string
): Promise<Api.AutocompleteOptions> {
  const response = await fetch(
    `${API_MIS_GASTOS_HOST}/autocomplete/spends/description?query=${query}`
  )

  const body = (await handleApiErrors(response)) as {
    query: string
    options: string[]
  }

  return body
}

export async function getAutocompleteOptionsForIncomeDescription(
  query: string
): Promise<Api.AutocompleteOptions> {
  const response = await fetch(
    `${API_MIS_GASTOS_HOST}/autocomplete/incomes/description?query=${query}`
  )

  const body = (await handleApiErrors(response)) as {
    query: string
    options: string[]
  }

  return body
}

async function post(url: string, json: object): Promise<object> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return handleApiErrors(response)
}

async function handleApiErrors(response: Response): Promise<object> {
  const body = await response.json()

  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof body.message == 'string' ? body.message : JSON.stringify(body)
    )
  }

  return body
}

function findCategory(categoryId: number, categories: Api.ListItem[]): Api.ListItem {
  const category = categories.find((category) => category.id == categoryId)
  if (typeof category == 'undefined') throw new Error(`Category ${categoryId} not found`)
  return category
}

function findSubcategory(subcategoryId: number, subcategories: Api.Subcategory[]): Api.Subcategory {
  const subcategory = subcategories.find((subcategory) => subcategory.id == subcategoryId)
  if (typeof subcategory == 'undefined') throw new Error(`Subcategory ${subcategoryId} not found`)
  return subcategory
}

function findGroup(groupId: number, groups: Api.Group[]): Api.Group {
  const group = groups.find((group) => group.id == groupId)
  if (typeof group == 'undefined') throw new Error(`Group ${groupId} not found`)
  return group
}

function findAccount(accountId: number, accounts: Api.ListItem[]): Api.ListItem {
  const account = accounts.find((account) => account.id == accountId)
  if (typeof account == 'undefined') throw new Error(`Account ${accountId} not found`)
  return account
}

function filterAccounts(
  accounts: Api.ListItem[],
  selectedCategories: Api.ListItem[],
  selectedSubcategories: Api.Subcategory[],
  selectedGroups: Api.Group[]
): Api.ListItem[] {
  const accountsCopy = accounts.slice(0)

  let filteredAccounts = accountsCopy
  if (selectedCategories.length > 0) {
    const accountIds = flatAccountIds(selectedCategories)
    if (accountIds.length > 0)
    filteredAccounts = accountsCopy.filter(
          (account) =>
            accountIds.includes(account.id)
        )
  }  

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : accountsCopy
  if (selectedSubcategories.length > 1 || (selectedSubcategories.length == 1 && selectedSubcategories[0].id != UNDEFINED_SUBCATEGORY.id)) {
    const accountIds = flatAccountIds(selectedSubcategories)
    if (accountIds.length > 0)
      filteredAccounts = filteredAccounts.filter(
          (account) =>
            accountIds.includes(account.id)
        )
  }

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : accountsCopy
  if (selectedGroups.length > 1 || (selectedGroups.length == 1 && selectedGroups[0].id != UNDEFINED_GROUP.id)) {
    const accountIds = flatAccountIds(selectedGroups)
    if (accountIds.length > 0)
      filteredAccounts = filteredAccounts.filter(
          (account) =>
            accountIds.includes(account.id)
        )
  }

  filteredAccounts = filteredAccounts.length > 0 ? filteredAccounts : accountsCopy
  return filteredAccounts.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
}

function flatAccountIds(list: Api.ListItem[]): number[] {
  return [...new Set(list.flatMap((item) => typeof item.accountIds != 'undefined' ? item.accountIds : []))]
}

function buildLoaderFunction(queryClient: QueryClient): LoaderFunction {
  return async () => {
    const queryCommonAttributes = {
      staleTime: Infinity,
      retry: 2
    }

    const categoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['categories'],
      queryFn: getCategories
    })

    const subcategoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['subcategories'],
      queryFn: getSubcategories
    })

    const groupsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['groups'],
      queryFn: getGroups
    })

    const accountsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['accounts'],
      queryFn: getAccounts
    })

    const incomeTypesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['income-types'],
      queryFn: getIncomeTypes
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
