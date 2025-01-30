import { MarkDownModule } from '@/modules/mark-down-module'
import { IntroduceContainer } from '@/widget/layouts/introduce-container'
import { TagSortableContainer } from '@/widget/tag-sortable-container'

export default async function HomePage() {
  const postModule = new MarkDownModule('post')
  const parsedTags = Array.from(postModule.getTagsWithFrontMatterList())
  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 px-6 md:p-24 md:py-6">
      <IntroduceContainer />
      <TagSortableContainer parsedTagList={parsedTags} />
    </main>
  )
}
