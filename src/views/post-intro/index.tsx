import { MarkDownModule } from '@/domain/markdown/modules'
import { Separator } from '@/shared/ui/separator'
import { ContentTabValueType } from '@/types/tags'
import { PostTab } from './components/post-tab'
import { SortedByTagPostList } from './components/sorted-by-tag-post-list'
import { TagBadgeList } from './components/tag-badge-list'
import { MarkdownListContextProvider } from './contexts/use-markdown-list-context'

interface PostIntroViewProps {
  tab?: ContentTabValueType
}

export default async function PostIntroView({ tab }: PostIntroViewProps) {
  const markdownList = new MarkDownModule(tab ?? 'post')
  const tagsWithFrontMatterList = markdownList.getTagsWithFrontMatterList()
  return (
    <MarkdownListContextProvider markdownList={tagsWithFrontMatterList}>
      <PostTab className="main-container" />
      <Separator />
      <TagBadgeList className="main-container" />
      <SortedByTagPostList className="main-container" />
    </MarkdownListContextProvider>
  )
}
