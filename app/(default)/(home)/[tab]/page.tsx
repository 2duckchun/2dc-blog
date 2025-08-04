export const revalidate = 36000

import { ContentTabValueType } from '@/types/tags'
import PostIntroView from '@/views/post-intro'

export default async function HomeView({
  params
}: {
  params: Promise<{ tab: ContentTabValueType }>
}) {
  const { tab } = await params

  return <PostIntroView tab={tab} />
}
