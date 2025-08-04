import { MarkDownFrontMatter } from '@/domain/markdown/schema'

export function parseFilePath(fileName: MarkDownFrontMatter['fileName']) {
  if (Array.isArray(fileName)) {
    return fileName.join('/')
  }
  return fileName
}
