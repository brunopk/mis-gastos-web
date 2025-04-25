const API_MIS_GASTOS_HOST = import.meta.env.VITE_API_MIS_GASTOS_HOST

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

  return body
}

export async function getSubcategories(): Promise<Api.Subcategory[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/subcategories`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return (body as { id: number; name: string; category_id: number }[]).map((subcategory) => ({
    id: subcategory.id,
    name: subcategory.name,
    categoryId: subcategory.category_id
  }))
}

export async function getGroups(): Promise<Api.Group[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/groups`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return (body as { id: number; name: string; subcategory_id: number }[]).map((group) => ({
    id: group.id,
    name: group.name,
    subcategoryId: group.subcategory_id
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
