import { FunctionComponent } from 'react'
import { TagBadgeList } from '@/components/tags/container/tag-badge-list'
import { TagContentPerTabs } from '@/components/tags/tag-content-per-tabs'
import { MarkDownModule } from '@/modules/mark-down-module'
import { TagsContextProvider } from '@/providers/tags-provider'

interface TagsPageProps {}

const TagsPage: FunctionComponent<TagsPageProps> = ({}) => {
  const postModule = new MarkDownModule('')
  const tags = postModule.getTagsWithFrontMatterList()
  const parsedTags = Array.from(tags)
  console.log(parsedTags)

  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 md:p-24">
      <div>
        <h2 className="text-xl font-semibold">TAGS</h2>
        <TagsContextProvider taglist={parsedTags}>
          <TagBadgeList />
          <div>
            <TagContentPerTabs />
          </div>
        </TagsContextProvider>
      </div>
    </main>
  )
}

export default TagsPage
