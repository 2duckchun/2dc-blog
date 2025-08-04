import { formatDate } from 'date-fns'
import { ko } from 'date-fns/locale'

interface FormatDateToStringProps {
  date: Date
  format: 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' | 'dd/MM/yyyy HH:mm:ss'
}

export function formatDateToLocale({ date, format }: FormatDateToStringProps) {
  return formatDate(date, format, {
    locale: ko
  })
}
