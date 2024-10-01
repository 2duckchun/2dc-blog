import { Metadata, ResolvingMetadata } from 'next'
import { PostContent } from '@/components/post/post-content'
import { customCompileMdx } from '@/mdx/custom-compile-mdx'
import { MarkDownModule } from '@/modules/mark-down-module'
import { MarkDownFrontMatter } from '@/types/matter'

interface PostPageProps {
  params: { slug: string[] }
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
  { params: { slug } }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { frontmatter } = await getPostData(slug[0])
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      images: [frontmatter.thumbnail, ...previousImages]
    }
  }
}

const PostPage = async ({ params: { slug } }: PostPageProps) => {
  const { content } = await getPostData(slug[0])
  return (
    <main className="min-h-screen p-4 px-8">
      <PostContent>{content}</PostContent>
    </main>
  )
}

export default PostPage
