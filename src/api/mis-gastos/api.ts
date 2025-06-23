import dayjs from 'dayjs'

const API_URL = import.meta.env.VITE_MIS_GASTOS_API_URL

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function authCallback(authCallbackRequest: Api.AuthCallbackRequest): Promise<void> {
  await post(`${API_URL}/oauth2/callback`, {
    authorization_code: authCallbackRequest.authorizationCode,
    code_verifier: authCallbackRequest.codeVerifier
  })
}

export async function getIncomeTypes(): Promise<Api.ListItem[]> {
  const response = await get(`${API_URL}/income-types`)
  return (
    response as {
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
  const response = await get(`${API_URL}/categories`)
  return (
    response as {
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
  const response = await get(`${API_URL}/subcategories`)
  return (
    response as { id: number; name: string; category_id: number; account_ids: number[] }[]
  ).map((subcategory) => ({
    id: subcategory.id,
    name: subcategory.name,
    categoryId: subcategory.category_id,
    accountIds: subcategory.account_ids
  }))
}

export async function getGroups(): Promise<Api.Group[]> {
  const response = await get(`${API_URL}/groups`)
  return (
    response as { id: number; name: string; subcategory_id: number; account_ids: number[] }[]
  ).map((group) => ({
    id: group.id,
    name: group.name,
    subcategoryId: group.subcategory_id,
    accountIds: group.account_ids
  }))
}

export async function getAccounts(): Promise<Api.ListItem[]> {
  const response = await get(`${API_URL}/accounts`)
  return response as Api.ListItem[]
}

export async function getSpends(): Promise<Api.Spend[]> {
  const response = await get(`${API_URL}/spends`)
  return (
    response as {
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

export async function getIncomes(): Promise<Api.Income[]> {
  const response = await get(`${API_URL}/incomes`)
  return (
    response as {
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
  const response = await get(`${API_URL}/autocomplete/spends/description?query=${query}`)
  return response as Api.AutocompleteOptions
}

export async function getAutocompleteOptionsForIncomeDescription(
  query: string
): Promise<Api.AutocompleteOptions> {
  const response = await get(`${API_URL}/autocomplete/incomes/description?query=${query}`)
  return response as Api.AutocompleteOptions
}

export async function createSpend(newSpend: Api.Spend): Promise<Api.Spend> {
  const response = (await post(`${API_URL}/spends`, {
    date: newSpend.date.toISOString(),
    category_id: newSpend.categoryId,
    subcategory_id: newSpend.subcategoryId,
    group_id: newSpend.groupId,
    account_id: newSpend.accountId,
    description: typeof newSpend.description == 'undefined' ? null : newSpend.description,
    value: newSpend.value
  })) as {
    id: number
    date: string
    category_id: number
    subcategory_id: number | null
    group_id: number | null
    account_id: number
    description: string | null
    value: number
  }

  return {
    id: response.id,
    date: dayjs(response.date),
    categoryId: response.category_id,
    subcategoryId: response.subcategory_id,
    groupId: response.group_id,
    accountId: response.account_id,
    description: response.description ? response.description : undefined,
    value: response.value
  }
}

export async function createIncome(newIncome: Api.Income): Promise<Api.Income> {
  const response = (await post(`${API_URL}/incomes`, {
    date: newIncome.date.toISOString(),
    income_type_id: newIncome.incomeTypeId,
    account_id: newIncome.accountId,
    description: typeof newIncome.description == 'undefined' ? null : newIncome.description,
    value: newIncome.value,
    spend: newIncome.spend ? { id: newIncome.spend.id! } : null
  })) as {
    id: number
    date: string
    income_type_id: number
    account_id: number
    description: string | null
    value: number
    spend: null | {
      id: number
      date: string
      category_id: number
      subcategory_id: number | null
      group_id: number | null
      account_id: number
      description: string | null
      value: number
    }
  }

  return {
    id: response.id,
    date: dayjs(response.date),
    incomeTypeId: response.income_type_id,
    accountId: response.account_id,
    description: response.description ? response.description : undefined,
    value: response.value,
    spend: !response.spend
      ? undefined
      : {
          id: response.spend.id,
          date: dayjs(response.spend.date),
          categoryId: response.spend.category_id,
          subcategoryId: response.spend.subcategory_id,
          groupId: response.spend.group_id,
          accountId: response.spend.account_id,
          description: response.description ? response.description : undefined,
          value: response.spend.value
        }
  }
}

async function post(url: string, json: object): Promise<object> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await handleApiErrors(response)
}

async function get(url: string): Promise<object> {
  const response = await fetch(url, { credentials: 'include' })
  return await handleApiErrors(response)
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
