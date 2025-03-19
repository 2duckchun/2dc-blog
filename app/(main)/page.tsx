import { MarkDownModule } from '@/modules/mark-down-module'
import { TagSortableContainer } from '@/widget/tag-sortable-container'

export default async function HomePage() {
  const postModule = new MarkDownModule('post')
  const parsedTags = Array.from(postModule.getTagsWithFrontMatterList())
  return (
    <main className="container">
      <TagSortableContainer parsedTagList={parsedTags} />
    </main>
  )
}
