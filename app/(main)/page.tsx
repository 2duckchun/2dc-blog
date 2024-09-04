import { IntroduceContainer } from '@/components/layouts/container/introduce-container'
import { PostFrontMatterList } from '@/components/post/container/post-front-matter-list'
import { MarkDownModule } from '@/modules/mark-down-module'

export default async function Home() {
  const markdown = new MarkDownModule('')
  const frontMatterList = markdown.getFrontMatterList()

  return (
    <main className="m-auto flex min-h-screen max-w-screen-xl flex-col items-center gap-5 p-2">
      <IntroduceContainer />
      <PostFrontMatterList list={frontMatterList} />
    </main>
  )
}
