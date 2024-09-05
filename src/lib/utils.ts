import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { MarkDownFrontMatter } from '@/types/matter'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseFilePath(fileName: MarkDownFrontMatter['fileName']) {
  if (Array.isArray(fileName)) {
    return fileName.join('/')
  }
  return fileName
}
