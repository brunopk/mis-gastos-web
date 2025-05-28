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

export const SESSION_STORAGE_PKCE_CODE_VERIFIER = "pkce_code_verifier"

export const GOOGLE_AUTH_SCOPES = "openid email https://www.googleapis.com/auth/tasks.readonly"

export const ICONS_MARGIN_IN_REM = 1

export const MENU_WIDTH_IN_REM = 13

export const BUTTON_WIDTH_IN_REM = 7

export const BOX_SMALL_PADDING_IN_REM = 0.5

export const BOX_PADDING_IN_REM = 1

export const MODAL_WIDTH = 500

// TODO: use DEFAULT_* constants  instead of hardcoding "-"

export const DATE_FORMAT = 'DD/MM/YYYY'

export const REIMBURSEMENT = 1

export const UNKNOWN_CATEGORY = '-'

export const UNKNOWN_SUBCATEGORY = '-'

export const UNKNOWN_GROUP = '-'

export const UNKNOWN_ACCOUNT = '-'

export const UNDEFINED_VALUE = ''

export const UNDEFINED_SUBCATEGORY: Api.Subcategory = {
  id: -1,
  name: 'Sin definir',
  categoryId: -1,
  accountIds: []
}

export const UNDEFINED_GROUP: Api.Group = {
  id: -1,
  name: 'Sin definir',
  subcategoryId: -1,
  accountIds: []
}
