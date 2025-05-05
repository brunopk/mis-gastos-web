const API_MIS_GASTOS_HOST = import.meta.env.VITE_API_MIS_GASTOS_HOST

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

export const utils = {
  findCategory,
  findSubcategory,
  findGroup,
  findAccount,
}

export const constants = {
  UNDEFINED_SUBCATEGORY,
  UNDEFINED_GROUP
}

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function getIncomeTypes(): Promise<Api.ListItem[]> {
  // TODO: use the real endpoint

  const response = await fetch(`${API_MIS_GASTOS_HOST}/categories`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return [
    { id: 1, name: 'Devolución' },
    { id: 2, name: 'Salario' }
  ]
}

export async function getCategories(): Promise<Api.Category[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/categories`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

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

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

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

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return (
    body as { id: number; name: string; subcategory_id: number; account_ids: number[] }[]
  ).map((group) => ({
    id: group.id,
    name: group.name,
    subcategoryId: group.subcategory_id,
    accountIds: group.account_ids
  }))
}

export async function getAccounts(): Promise<Api.Account[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/accounts`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return body
}

export async function getSpends(): Promise<Api.Spend[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/spends`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

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
    date: spend.date,
    categoryId: spend.category_id,
    subcategoryId: spend.subcategory_id,
    groupId: spend.group_id,
    accountId: spend.account_id,
    description: spend.description,
    value: spend.value
  }))

  return body
}

export async function createSpend(newSpend: Api.Spend): Promise<Api.Spend> {
  const body = (await post(`${API_MIS_GASTOS_HOST}/spends`, {
    date: newSpend.date,
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
    date: body.date,
    categoryId: body.category_id,
    subcategoryId: body.subcategory_id,
    groupId: body.group_id,
    accountId: body.account_id,
    description: body.description,
    value: body.value
  }
}

export async function getIncomes(): Promise<Api.Income[]> {
  // TODO: uncomment this (its just for testing)

  /*const response = await fetch(`${API_MIS_GASTOS_HOST}/incomes`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return (
    body as {
      id: number
      date: string
      income_type_id: number
      account_id: number
      description?: string
      value: number
      spend?: {
        id: number
        date: string
        category_id: number
        subcategory_id: number
        group_id: number
        account_id: number
        description: string
        value: number
      }
    }[]
  ).map((income) => ({
    id: income.id,
    date: income.date,
    incomeTypeId: income.income_type_id,
    accountId: income.account_id,
    description: income.description,
    value: income.value,
    spend: typeof income.spend === 'undefined' ? undefined : {
      id: income.spend.id,
      date: income.spend.date,
      categoryId: income.spend.category_id,
      subcategoryId: income.spend.subcategory_id,
      groupId: income.spend.group_id,
      accountId: income.spend.account_id,
      description: income.spend.description, 
      value: income.spend.value
    }
  }))*/

  // TODO: remove this (its just for testing)

  return [
    {
      id: 1,
      date: '2025-01-02',
      incomeTypeId: 1,
      accountId: 1,
      value: 10,
      spend: {
        id: 2,
        categoryId: 1,
        subcategoryId: 1,
        groupId: 1,
        accountId: 2,
        date: '2025-01-01',
        value: 1
      }
    },
    { id: 2, date: '2025-01-03', incomeTypeId: 2, accountId: 1, value: 10, description: 'Test' }
  ]
}

// TODO: invoke the real endpoint

export async function getDescriptionAutocompleteOptions(
  text: string
): Promise<Api.DescriptionAutocompleteOptions> {
  const descriptions = ['Padel', 'Supermercado', 'Comida', 'Comida restaurant']
  return new Promise((resolve) => {
    setTimeout(
      () => {
        console.log(`Returning results from getDescriptions for ${text}`)
        const result = descriptions.filter((description) => description.includes(text))
        resolve({ search: text, options: result })
      },
      Math.floor(Math.random() * 100)
    )
  })
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

  // TODO: handle errors the same way in all requests

  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof body.message == 'string' ? body.message : JSON.stringify(body)
    )
  }

  return body
}

function findCategory(categoryId: number, categories: Api.Category[]): Api.Category {
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

function findAccount(accountId: number, accounts: Api.Account[]): Api.Account {
  const account = accounts.find((account) => account.id == accountId)
  if (typeof account == 'undefined') throw new Error(`Account ${accountId} not found`)
  return account
}
