import dayjs, { Dayjs } from 'dayjs'
import { paths } from './Routes'

type Formatter = (id: number | string | Dayjs | null) => string

export function getPageTitle(path: string) {
  if (path.startsWith(paths.spends.list)) {
    return 'Spends'
  } else if (path.startsWith(paths.spends.new)) {
    return 'New spend'
  } else {
    return ''
  }
}

export function buildDateFormatter(): Formatter {
  return (date: number | string | Dayjs | null) => {
    if (!date) throw new Error(`ISO date is null`)
    if (typeof date === 'number') throw new Error(`Cannot format number ${date} to string`)

    date = typeof date == 'string' ? dayjs(date) : date

    return date.format('YYYY-MM-DD')
  }
}

export function buildListItemFormatter(list: Api.ListItem[]): Formatter {
  return (id: number | string | Dayjs | null) => {
    if (!id) return '-'

    const parsedId = typeof id === 'string' ? parseInt(id) : id
    const foundItem = list.find((item) => item.id == parsedId)

    if (typeof foundItem === 'undefined') {
      const stringifiedList = JSON.stringify(list)
      throw new Error(`Element ${id} not found in list ${stringifiedList}`)
    }

    return foundItem.name
  }
}

export function toDate(date: Dayjs) {
  return date.set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0)
}
