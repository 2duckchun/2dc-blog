import { MarkDownFrontMatter } from '@/types/matter'

export function parseFilePath(fileName: MarkDownFrontMatter['fileName']) {
  if (Array.isArray(fileName)) {
    return fileName.join('/')
  }
  return fileName
}
