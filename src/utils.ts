import {paths} from './Routes'

type Formatter = (id: number | string | null) => string

// TODO: remove date formatter (if it's really not necessary)

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})


export function getPageTitle(path: string) {
  if (path.startsWith(paths.spends.list)) {
    return 'Spends'
  } else if (path.startsWith(paths.spends.new)) {
    return 'New spend'
  } else {
    return ""
  }
}

export function buildDateFormatter(): Formatter {
  return (isoDate: string | number | null) => {
    if (!isoDate) throw new Error(`ISO date is null`)

    if (typeof isoDate === 'number') throw new Error(`Cannot format number ${isoDate} to string`)

    const date = new Date(isoDate)
    return dateFormatter.format(date)
  }
}

export function buildListItemFormatter(list: Api.ListItem[]): Formatter {
  return (id: number | string | null) => {
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
