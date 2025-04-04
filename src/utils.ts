import {paths} from './Routes'

export function getPageTitle(path: string) {
  if (path.startsWith(paths.spends.list)) {
    return 'Spends'
  } else if (path.startsWith(paths.spends.new)) {
    return 'New spend'
  } else {
    return ""
  }
}
