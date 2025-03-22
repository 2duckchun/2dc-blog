import { Metadata, ResolvingMetadata } from 'next'
import { MarkDownModule } from '@/modules/mark-down-module'
import { customCompileMdx } from '@/shared/lib/mdx/custom-compile-mdx'
import { MarkDownFrontMatter } from '@/types/matter'
import { UtterancesComments } from '@/widget/comment'
import { PostContent } from '@/widget/post/post-content'

interface PostPageProps {
  params: Promise<{ slug: string[] }>
}

const CONTENT_PATH_LIST = ['post']

const getPostData = async (slug: string) => {
  const markdownModule = new MarkDownModule(CONTENT_PATH_LIST)
  const rawMarkDown = await markdownModule.getMarkdownFile(slug)
  const { content, frontmatter } = await customCompileMdx({
    sourse: rawMarkDown
  })
  return { content, frontmatter: frontmatter as MarkDownFrontMatter }
}

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params

  const { frontmatter } = await getPostData(slug[0])
  const previousImages = (await parent).openGraph?.images || []
  return {
    metadataBase: new URL('https://blog.2duckchun.com'),
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      images: [frontmatter.thumbnail, ...previousImages]
    }
  }
}

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params

  const { content } = await getPostData(slug[0])
  return (
    <main className="min-h-screen p-4 px-8">
      <PostContent>{content}</PostContent>
      <UtterancesComments />
    </main>
  )
}

export default PostPage
