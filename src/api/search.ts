'use server'

import { MarkDownModule } from '@/modules/mark-down-module'

const markdown = new MarkDownModule('')
const frontMatterList = markdown.getFrontMatterList()

export const getSearchedFrontMatterTitle = async (searchValue: string) => {
  if (searchValue === '') return []
  // console.time()
  const searchedTitle = frontMatterList.filter((frontMatterList) => {
    return frontMatterList.title.indexOf(searchValue) !== -1
  })
  // console.timeEnd()
  return searchedTitle
}
