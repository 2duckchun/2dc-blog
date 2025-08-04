'use server'

import { MarkDownModule } from '@/domain/markdown/modules'

const markdown = new MarkDownModule('')
const frontMatterList = markdown.getFrontMatterList()

export const searchMarkdownFrontMatterInServerFile = async (
  searchValue: string
) => {
  if (searchValue === '') return []
  // console.time()
  const searchedTitle = frontMatterList.filter((frontMatterList) => {
    return frontMatterList.title.indexOf(searchValue) !== -1
  })
  // console.timeEnd()
  return searchedTitle
}
