export const revalidate = 36000

import { ContentTabValueType } from '@/types/tags'
import PostView from '@/views/post'

export default async function HomeView({
  params
}: {
  params: Promise<{ tab: ContentTabValueType }>
}) {
  const { tab } = await params

  return <PostView tab={tab} />
}
