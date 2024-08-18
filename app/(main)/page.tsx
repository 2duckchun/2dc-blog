import { PostCard } from '@/components/post/post-card'
import { MarkDownModule } from '@/modules/mark-down-module'

export default async function Home() {
  const markdown = new MarkDownModule('')
  const grayMatterList = markdown.newGetFrontMatterList()

  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col items-center gap-5 p-2 md:p-24">
      <div className="m-auto flex w-full flex-col gap-3">
        {grayMatterList.map((item, index) => {
          return <PostCard key={item.title} frontmatter={item} />
        })}
      </div>
    </main>
  )
}
