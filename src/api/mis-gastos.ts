const API_MIS_GASTOS_HOST = import.meta.env.VITE_API_MIS_GASTOS_HOST

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
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

  return body
}
