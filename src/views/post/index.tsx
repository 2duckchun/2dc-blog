import { MarkDownModule } from '@/modules/mark-down-module'
import { Separator } from '@/shared/ui/separator'
import { ContentTabValueType } from '@/types/tags'
import { PostTab } from './components/post-tab'
import { TagSortedPostList } from './components/sorted-by-tag-post-list/tag-sorted-post-list'
import { TagBadgeList } from './components/tag-badge-list'
import { MarkdownListContextProvider } from './contexts/use-markdown-list-context'

interface PostViewProps {
  tab?: ContentTabValueType
}

export default async function PostView({ tab }: PostViewProps) {
  const markdownList = new MarkDownModule(tab ?? 'post')
  const tagsWithFrontMatterList = markdownList.getTagsWithFrontMatterList()
  return (
    <MarkdownListContextProvider markdownList={tagsWithFrontMatterList}>
      <PostTab className="main-container" />
      <Separator />
      <TagBadgeList className="main-container" />
      <TagSortedPostList className="main-container" />
    </MarkdownListContextProvider>
  )
}
