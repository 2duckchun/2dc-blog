import { getMarkdownContentData } from '@/shared/lib/get-markdown-content-data'
import { PostContentContainer } from './content-container'

interface PostContentViewProps {
  params: Promise<{ tabs: string[] }>
}

export default async function PostContentView({
  params
}: PostContentViewProps) {
  const { tabs } = await params
  const [tab, markdownName] = tabs
  const { content } = await getMarkdownContentData(tab, markdownName)
  return <PostContentContainer>{content}</PostContentContainer>
}
