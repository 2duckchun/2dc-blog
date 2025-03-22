'use server'

import { MarkDownModule } from '@/modules/mark-down-module'

export const getMarkdownListWithTagPerContent = async (fileName: string) => {
  const markdown = new MarkDownModule(fileName)
  const content = markdown.getTagsWithFrontMatterList()
  return Array.from(content)
}
