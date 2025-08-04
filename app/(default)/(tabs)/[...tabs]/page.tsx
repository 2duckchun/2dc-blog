export const revalidate = 36000

import { Metadata } from 'next'
import { ResolvingMetadata } from 'next'
import { getMarkdownContentData } from '@/shared/lib/get-markdown-content-data'
import PostContentView from '@/views/post-content'

interface TabPageProps {
  params: Promise<{ tabs: string[] }>
}

export async function generateMetadata(
  { params }: TabPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { tabs } = await params
  const [tab, markdownName] = tabs

  const { frontmatter } = await getMarkdownContentData(tab, markdownName)
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

export default async function TabPage({ params }: TabPageProps) {
  const { tabs } = await params
  const [tab, markdownName] = tabs

  return <PostContentView params={params} />
}
