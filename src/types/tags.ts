import { TAB_LIST } from '@/shared/constants/tab-list'
import { MarkDownFrontMatter } from '../domain/markdown/schema'

export type TagName = string

export type TagsDetailPost = {
  count: number
  frontMatter: MarkDownFrontMatter[]
}

export type TagsData = [string, TagsDetailPost]

export type ContentTabValueType = (typeof TAB_LIST)[number]['value']
