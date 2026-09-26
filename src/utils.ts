import dayjs, { Dayjs } from 'dayjs'
import type { ApiListItem } from './api/mis-gastos/types'
import { PATHS } from './constants'

export type DayjsDate = Dayjs

export type Formatter = (id: number | string | Dayjs | null) => string

export function getPageTitle(path: string) {
  if (path.startsWith(PATHS.SPENDS.INDEX + PATHS.SPENDS.LIST)) {
    return 'Spends'
  } else if (path.startsWith(PATHS.SPENDS.INDEX + PATHS.SPENDS.NEW)) {
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

export function buildListItemFormatter(list: ApiListItem[]): Formatter {
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

export function difference<T>(A: T[] | Set<T>, B: T[] | Set<T>): Set<T> {
  return new Set(
    [...A].filter((a) =>
      B instanceof Set ? !B.has(a) : typeof B.find((b) => a == b) == 'undefined'
    )
  )
}

export function union<T>(A: T[] | Set<T>, B: T[] | Set<T>): Set<T> {
  return new Set([...A, ...B])
}

export function intersection<T>(A: T[] | Set<T>, B: T[] | Set<T>): Set<T> {
  return new Set(
    [...A].filter((a) =>
      B instanceof Set ? B.has(a) : typeof B.find((b) => a == b) != 'undefined'
    )
  )
}

export function deepCopyNestedArray<T>(source: T[][]): T[][] {
  return source.map((subList) => subList.map((t) => ({ ...t })))
}

export function deepCopyArray<T>(source: T[]): T[] {
  return source.map((t) => ({ ...t }))
}

/**
 * Sets hours, minutes, seconds and milliseconds to 0
 * @param date date to be modified
 * @returns returns a new object modified as mentioned before
 */
export function toDate(date: Dayjs) {
  return date.set('hours', 0).set('minutes', 0).set('seconds', 0).set('milliseconds', 0)
}

export function generateCodeVerifier(length = 128) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

function base64URLEncode(buffer: Uint8Array<ArrayBuffer> | ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
