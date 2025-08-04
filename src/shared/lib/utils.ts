import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const throttle = (func: (...args: any) => void, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}
