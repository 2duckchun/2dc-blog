import { FunctionComponent } from 'react'
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
        <div>
          {parsedTags.map((items) => {
            return (
              <div className="px-2" key={items[0]}>
                <span>{items[0]}</span>
                <span>{items[1].count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default TagsPage
