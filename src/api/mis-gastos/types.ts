import type { DayjsDate } from '../../utils'

export interface ApiAuthCallbackRequest {
  authorizationCode: string
  codeVerifier: string
}

export interface ApiListItem {
  id: number
  name: string
  accountIds?: number[]
}

export interface ApiSubcategory extends ApiListItem {
  categoryId: number
}

export interface ApiGroup extends ApiListItem {
  subcategoryId: number
}

export interface ApiAutocompleteOptions {
  query: string
  options: string[]
}

export interface ApiSpend {
  id?: number
  date: DayjsDate
  categoryId: number
  subcategoryId: number | null
  groupId: number | null
  accountId: number
  description?: string
  value: number
}

export interface ApiIncome {
  id?: number
  date: DayjsDate
  incomeTypeId: number
  accountId: number
  description?: string
  value: number
  spend?: ApiSpend
}

export type ApiCategoriesMap = Map<number, ApiListItem>

export type ApiSubcategoriesMap = Map<number, ApiSubcategory>
