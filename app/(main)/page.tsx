import { Suspense } from 'react'
import { IntroduceContainer } from '@/components/layouts/container/introduce-container'
import { TagBadgeList } from '@/components/tags/container/tag-badge-list'
import { TagContentPerTabsContainer } from '@/components/tags/container/tag-content-per-tabs-container'
import { MarkDownModule } from '@/modules/mark-down-module'
import { TagsContextProvider } from '@/providers/tags-provider'

export default async function Home() {
  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 px-6 md:p-24 md:py-6">
      <IntroduceContainer />
      <PostSortedTagContainer />
    </main>
  )
}

const PostSortedTagContainer = () => {
  const postModule = new MarkDownModule('post')
  const tags = postModule.getTagsWithFrontMatterList()
  const parsedTags = Array.from(tags)
  return (
    <section>
      <h2 className="text-lg font-semibold">TAGS</h2>
      <TagsContextProvider taglist={parsedTags}>
        <TagBadgeList />
        <Suspense>
          <TagContentPerTabsContainer />
        </Suspense>
      </TagsContextProvider>
    </section>
  )
}
