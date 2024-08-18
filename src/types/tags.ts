import { MarkDownMatter } from './matter'

export type TagsDetailPost = {
  count: number
  frontMatter: MarkDownMatter[]
}

export type TagsData = [string, TagsDetailPost]
