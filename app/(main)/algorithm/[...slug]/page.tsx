import { PostContent } from '@/components/post/post-content'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

interface AlgorithmPostPageProps {
  params: { slug: string[] }
}
const CONTENT_PATH_LIST = ['algorithm']

const AlgorithmPostPage = async ({
  params: { slug }
}: AlgorithmPostPageProps) => {
  const markdownModule = new MarkDownModule(CONTENT_PATH_LIST)
  const rawMarkDown = await markdownModule.getMarkdownFile(slug[0])
  const { content } = await customCompileMdx({
    sourse: rawMarkDown
  })
  return (
    <section className="min-h-screen p-4 px-8">
      <PostContent>{content}</PostContent>
    </section>
  )
}

export default AlgorithmPostPage
