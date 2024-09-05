import { Metadata } from 'next'
import { PostContent } from '@/components/post/post-content'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'

export const metadata: Metadata = {
  title: `POSTS - Algorithm`,
  description: '알고리즘에 관련된 포스트를 모아놓은 곳입니다.'
}

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
    <main className="min-h-screen p-4 px-8">
      <PostContent>{content}</PostContent>
    </main>
  )
}

export default AlgorithmPostPage
