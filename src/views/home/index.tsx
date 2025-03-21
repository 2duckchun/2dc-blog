import { MarkDownModule } from '@/modules/mark-down-module'
import { TagBadgeList } from '@/widget/tag-sortable-container/components/tag-badge-list'
import { TagSortedPostList } from '@/widget/tag-sortable-container/tag-sorted-post-list'
import { TagsContextProvider } from './contexts/use-tag-context-provider'

export default function HomeView() {
  const postModule = new MarkDownModule('post')
  const parsedTags = Array.from(postModule.getTagsWithFrontMatterList())
  return (
    <TagsContextProvider taglist={parsedTags}>
      <TagBadgeList />
      <TagSortedPostList />
    </TagsContextProvider>
  )
}
