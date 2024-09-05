import { Metadata } from 'next'
import { FunctionComponent, Suspense } from 'react'
import { TagBadgeList } from '@/components/tags/container/tag-badge-list'
import { TagContentPerTabsContainer } from '@/components/tags/container/tag-content-per-tabs-container'
import { MarkDownModule } from '@/modules/mark-down-module'
import { TagsContextProvider } from '@/providers/tags-provider'

export const metadata: Metadata = {
  title: `TAGS`,
  description: '태그를 이용해 원하는 포스트를 선택하실 수 있습니다.'
}

interface TagsPageProps {}

const TagsPage: FunctionComponent<TagsPageProps> = ({}) => {
  const postModule = new MarkDownModule('')
  const tags = postModule.getTagsWithFrontMatterList()
  const parsedTags = Array.from(tags)

  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 md:p-24">
      <h2 className="text-xl font-semibold">TAGS</h2>
      <TagsContextProvider taglist={parsedTags}>
        <TagBadgeList className="my-5" />
        <Suspense>
          <TagContentPerTabsContainer />
        </Suspense>
      </TagsContextProvider>
    </main>
  )
}

export default TagsPage
