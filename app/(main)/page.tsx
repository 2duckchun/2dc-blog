import { PostCard } from '@/components/post-card'
import { MarkDownModule } from '@/modules/mark-down-module'

const CONTENT_PATH_LIST = ['content', 'post']

export default async function Home() {
  const markdown = new MarkDownModule(CONTENT_PATH_LIST)
  const grayMatterList = markdown.getFrontMatterList()

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-2 md:p-24">
      <div className="m-auto flex w-full flex-col gap-3 md:flex-row md:justify-evenly">
        {grayMatterList.map((item, index) => {
          return <PostCard key={item.title} frontmatter={item} />
        })}
      </div>
    </main>
  )
}
