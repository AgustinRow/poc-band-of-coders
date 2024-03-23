import { DateHandlerFormats } from './constants'
import dayjs from './dayjs'

export function isValidDate (date: string, format: DateHandlerFormats): boolean {
  return dayjs(date, format, true).isValid()
}

export function fromDateToISO8601Date (date: Date | string): string {
  return dayjs(date).format(DateHandlerFormats.ISO8601_FORMAT_DATE)
}
export function fromDateToISO8601Datetime (date: Date): string {
  return dayjs(date).format(DateHandlerFormats.ISO8601_FORMAT_DATETIME)
}

export function fromSecondsToHoursDuration (seconds: number): string {
  return dayjs.duration(seconds, 'seconds').format('HH:mm')
}

export function fromDateFormat (date: Date | string, format: string): string {
  return dayjs(date).format(format)
}

export function getDate (date?: Date | string): Date {
  return dayjs(date).toDate()
}

export function fromISO8601StringToDate (date: string): Date {
  return dayjs(date, DateHandlerFormats.ISO8601_FORMAT_DATE, true).toDate()
}
export function getCurrentDateISO8601 (): string {
  return dayjs().format(DateHandlerFormats.ISO8601_FORMAT_DATE)
}

export function fromISO8601StringFormat (date: string, format: string): string {
  return dayjs(date).format(format)
}

export function getCurrentDateTimeISO8601 (): string {
  return dayjs().format(DateHandlerFormats.ISO8601_FORMAT_DATETIME)
}

export function dateIsAfter (dateA: string, dateB: string): boolean {
  return dayjs(dateA, DateHandlerFormats.ISO8601_FORMAT_DATE, true).isAfter(dayjs(dateB, DateHandlerFormats.ISO8601_FORMAT_DATE, true))
}

export function dateIsSame (dateA: string, dateB: string): boolean {
  return dayjs(dateA, DateHandlerFormats.ISO8601_FORMAT_DATE, true).isSame(dayjs(dateB, DateHandlerFormats.ISO8601_FORMAT_DATE, true))
}

export function dateObjectIsSameOrAfter (dateA: Date, dateB: Date): boolean {
  return dayjs(dateA).isSameOrAfter(dayjs(dateB), 'date')
}

export function dateObjectIsSame (dateA: Date, dateB: Date): boolean {
  return dayjs(dateA).isSame(dayjs(dateB), 'date')
}

export function dateObjectIsAfter (dateA: Date, dateB: Date): boolean {
  return dayjs(dateA).isAfter(dayjs(dateB))
}

export function getCurrentDateFormatted (format: string): string {
  return dayjs().format(format)
}

export function getDayName (day: number): string {
  return dayjs(day).format('ddd')
}

export function getNextWeekFormatted (format: string): string {
  const nextMonday = dayjs().startOf('week').add(1, 'week').add(1, 'day')
  return dayjs(nextMonday).format(format)
}

export function getWeekDay (day: number, selectedDate: string): string {
  let weekStart
  if (selectedDate === '') {
    weekStart = dayjs().startOf('week').format('YYYY-MM-DD')
  } else {
    weekStart = dayjs(selectedDate).startOf('week').format('YYYY-MM-DD')
  }
  const weekDay = dayjs(weekStart).add(day, 'day').format('YYYY-MM-DD')
  return weekDay
}

export function startOfMonth (referenceDate: string | Date | undefined): string {
  return dayjs(referenceDate).startOf('month').format('YYYY-MM-DD')
}

export function endOfMonth (referenceDate: string | Date | undefined): string {
  return dayjs(referenceDate).endOf('month').format('YYYY-MM-DD')
}

export function getTimestampFromDate (date: Date): number {
  return dayjs(date).valueOf()
}

export function getWeekNumber (date: string | Date): number {
  return dayjs(date).isoWeek()
}

interface AddUnitOfTimeToDateArguments {
  date: string
  day?: number
  week?: number
  month?: number
  quarter?: number
  year?: number
  hour?: number
  minute?: number
  second?: number
  millisecond?: number
}
export function addUnitToDateISO8601 (args: AddUnitOfTimeToDateArguments): string {
  const { date, ...units } = args
  let result = dayjs(date)
  Object.entries(units).forEach(([unit, amount]) => {
    // @ts-expect-error
    result = result.add(amount, unit)
  })
  return result.toISOString()
}
export function getDayNumber (date: string | Date): number {
  return dayjs(date).day()
}

export function getDiffDate (date: string | Date, currentDate: Date): number {
  const startDay = dayjs(currentDate)
  return startDay.diff(date, 'day')
}

export function getDiffWeek (date: string | Date, currentDate: Date): number {
  const startDay = dayjs(currentDate)
  return startDay.diff(date, 'weeks')
}
