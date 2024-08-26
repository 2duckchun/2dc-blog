import { IntroduceContainer } from '@/components/layouts/container/introduce-container'
import { PostCard } from '@/components/post/post-card'
import { MarkDownModule } from '@/modules/mark-down-module'

export default async function Home() {
  const markdown = new MarkDownModule('')
  const frontMatterList = markdown.newGetFrontMatterList()

  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col items-center p-2">
      <IntroduceContainer />
      <div className="m-auto flex w-full flex-col gap-3">
        {frontMatterList.map((item, index) => {
          return <PostCard key={item.title} frontmatter={item} />
        })}
      </div>
    </main>
  )
}
