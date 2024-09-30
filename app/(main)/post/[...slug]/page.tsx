import { PostContent } from '@/components/post/post-content'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

interface PostPageProps {
  params: { slug: string[] }
}

const getPostData = async (slug: string) => {
  const markdownModule = new MarkDownModule(CONTENT_PATH_LIST)
  const rawMarkDown = await markdownModule.getMarkdownFile(slug)
  const { content, frontmatter } = await customCompileMdx({
    sourse: rawMarkDown
  })
  return { content, frontmatter }
}

export async function generateMetadata() {}

const CONTENT_PATH_LIST = ['post']

const PostPage = async ({ params: { slug } }: PostPageProps) => {
  const { content } = await getPostData(slug[0])

  return (
    <main className="min-h-screen p-4 px-8">
      <PostContent>{content}</PostContent>
    </main>
  )
}

export default PostPage
