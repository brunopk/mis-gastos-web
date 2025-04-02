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

  return body
}

export async function getGroups(): Promise<Api.Group[]> {
  const response = await fetch(`${API_MIS_GASTOS_HOST}/groups`)

  const body = await response.json()

  if (!response.ok) {
    const stringifiedBody = JSON.stringify(body)
    throw new ApiError(response.status, `Status: ${response.status} Message: ${stringifiedBody}`)
  }

  return body
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
