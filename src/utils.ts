import ROUTES from './routes'

export function getPageTitle(path: string) {
  if (path.startsWith(ROUTES.SPENDS.LIST)) {
    return 'Spends'
  } else if (path.startsWith(ROUTES.SPENDS.NEW)) {
    return 'New spend'
  } else {
    return ""
  }
}
