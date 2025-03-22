'use client'

import { Separator } from '@/shared/ui/separator'
import { TagSortedPostList } from '@/views/home/components/sorted-by-tag-post-list/tag-sorted-post-list'
import { TagBadgeList } from '@/views/home/components/tag-badge-list'
import { HomeTab } from './components/home-tab'
import { MarkdownListContextProvider } from './contexts/use-markdown-list-context'

export default function HomeView() {
  return (
    <MarkdownListContextProvider>
      <HomeTab className="main-container" />
      <Separator />
      <TagBadgeList className="main-container" />
      <TagSortedPostList className="main-container" />
    </MarkdownListContextProvider>
  )
}
