import { Metadata } from 'next'
import { PostContent } from '@/components/post/post-content'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

interface PostPageProps {
  params: { slug: string[] }
}

export const metadata: Metadata = {
  title: `POSTS`,
  description: '그간 업로드했던 포스트를 보실 수 있습니다.'
}

const CONTENT_PATH_LIST = ['post']

const PostPage = async ({ params: { slug } }: PostPageProps) => {
  const markdownModule = new MarkDownModule(CONTENT_PATH_LIST)
  const rawMarkDown = await markdownModule.getMarkdownFile(slug[0])
  const { content } = await customCompileMdx({
    sourse: rawMarkDown
  })
  return (
    <main className="min-h-screen p-4 px-8">
      <PostContent>{content}</PostContent>
    </main>
  )
}

export default PostPage
