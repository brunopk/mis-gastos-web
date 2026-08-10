import type { ApiGroup, ApiSubcategory } from './api/mis-gastos/types'

export const PATHS = {
  INDEX: '/',
  LOGIN: '/login',
  SPENDS: {
    INDEX: '/spends/',
    LIST: 'list',
    NEW: 'new'
  },
  INCOME: {
    INDEX: '/income/',
    NEW: 'new',
    LIST: 'list'
  }
}

export const SESSION_STORAGE_PKCE_CODE_VERIFIER = 'pkce_code_verifier'

export const GOOGLE_AUTH_SCOPES = 'openid email https://www.googleapis.com/auth/tasks.readonly'

export const ICONS_MARGIN_IN_REM = 1

export const MENU_WIDTH_IN_REM = 13

export const BUTTON_WIDTH_IN_REM = 7

export const BOX_SMALL_PADDING_IN_REM = 0.5

export const BOX_PADDING_IN_REM = 0.6

export const MODAL_WIDTH = 500

// TODO: use DEFAULT_* constants  instead of hardcoding "-"

export const DATE_PICKER_FORMAT = 'DD/MM/YYYY'

export const REIMBURSEMENT = 1

export const UNKNOWN_STRING = '-'

export const NOT_DEFINED = 'Sin definir'

export const DATE_WARNING_MSG = 'Date cannot be in the future'

export const VALUE_WARNING_MSG = 'Value must greater than 0'

export const UNDEFINED_SUBCATEGORY: ApiSubcategory = {
  id: -1,
  name: NOT_DEFINED,
  categoryId: -1,
  accountIds: []
}

export const UNDEFINED_GROUP: ApiGroup = {
  id: -1,
  name: NOT_DEFINED,
  subcategoryId: -1,
  accountIds: []
}
