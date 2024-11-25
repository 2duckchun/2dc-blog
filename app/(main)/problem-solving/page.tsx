import { FunctionComponent, Suspense } from 'react'
import { TagBadgeList } from '@/components/tags/container/tag-badge-list'
import { TagContentPerTabsContainer } from '@/components/tags/container/tag-content-per-tabs-container'
import { MarkDownModule } from '@/modules/mark-down-module'
import { TagsContextProvider } from '@/providers/tags-provider'

interface ProblemSolvingPageProps {}

const ProblemSolvingPage: FunctionComponent<ProblemSolvingPageProps> = ({}) => {
  const problemSolvingPostModule = new MarkDownModule('problem-solving')
  const tags = problemSolvingPostModule.getTagsWithFrontMatterList()
  const parsedTags = Array.from(tags)
  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 px-6 md:p-24 md:py-6">
      <h2 className="text-xl font-semibold">Problem Solving</h2>
      <TagsContextProvider taglist={parsedTags}>
        <TagBadgeList />
        <Suspense>
          <TagContentPerTabsContainer />
        </Suspense>
      </TagsContextProvider>
    </main>
  )
}

export default ProblemSolvingPage
