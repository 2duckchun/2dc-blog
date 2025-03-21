'use client'

import { Separator } from '@/shared/ui/separator'
import { TagBadgeList } from '@/widget/tag-sortable-container/components/tag-badge-list'
import { TagSortedPostList } from '@/widget/tag-sortable-container/tag-sorted-post-list'
import { HomeTab } from './components/home-tab'

export default function HomeView() {
  return (
    <>
      <HomeTab className="main-container" />
      <Separator />
      <TagBadgeList className="main-container" />
      <TagSortedPostList className="main-container" />
    </>
  )
}
