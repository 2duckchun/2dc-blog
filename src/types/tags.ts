import { MarkDownFrontMatter } from './matter'

export type TagsDetailPost = {
  count: number
  frontMatter: MarkDownFrontMatter[]
}

export type TagsData = [string, TagsDetailPost]
