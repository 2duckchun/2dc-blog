import { PostContent } from '@/components/post-content'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

interface PostPageProps {
  params: { slug: string[] }
}
const CONTENT_PATH_LIST = ['content', 'post']

const PostPage = async ({ params: { slug } }: PostPageProps) => {
  const markdownModule = new MarkDownModule(CONTENT_PATH_LIST)
  const rawMarkDown = await markdownModule.getMarkdownFile(slug[0])
  const { content } = await customCompileMdx({
    sourse: rawMarkDown
  })
  return (
    <section className="p-4 px-8">
      <PostContent>{content}</PostContent>
    </section>
  )
}

export default PostPage
