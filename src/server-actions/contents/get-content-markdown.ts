'use server'

import { MarkDownModule } from '@/modules/mark-down-module'
import { TagsDetailPost } from '@/types/tags'

export const getMarkdownListWithTagPerContent = async (
  fileName: string
): Promise<[string, TagsDetailPost][]> => {
  try {
    const markdown = new MarkDownModule(fileName)
    const content = markdown.getTagsWithFrontMatterList()
    return Array.from(content)
  } catch (error) {
    console.error('마크다운 콘텐츠 가져오기 오류:', error)
    return []
  }
}
