import { FunctionComponent } from 'react'
import { PostBadge } from '@/components/post/post-badge'
import { MarkDownModule } from '@/modules/mark-down-module'

interface TagsPageProps {}

const TagsPage: FunctionComponent<TagsPageProps> = ({}) => {
  const postModule = new MarkDownModule('')
  const postFrontMatter = postModule.newGetFrontMatterList()
  const tags = postModule.getTagsWithFrontMatterList()
  const parsedTags = Array.from(tags)
  parsedTags.forEach((items) => {
    console.log(items)
  })
  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 md:p-24">
      <div>
        <h2 className="text-xl font-semibold">TAGS</h2>
        <div className="flex gap-3">
          {parsedTags.map((items) => {
            return (
              <PostBadge
                key={items[0]}
                title={items[0]}
                count={items[1].count}
              />
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default TagsPage
