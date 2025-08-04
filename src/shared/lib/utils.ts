import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { MarkDownFrontMatter } from '@/types/matter'
import { ContentTabValueType } from '@/types/tags'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseFilePath(fileName: MarkDownFrontMatter['fileName']) {
  if (Array.isArray(fileName)) {
    return fileName.join('/')
  }
  return fileName
}

export const parsePathnameAndMapToTab = (
  pathname: string
): ContentTabValueType => {
  const path = pathname.split('/')
  const parsedPath = path[path.length - 1]
  switch (parsedPath) {
    case 'problem-solving':
      return 'problem-solving'
    case 'note':
      return 'note'
    default:
      return 'post'
  }
}

export const throttle = (func: (...args: any) => void, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}
