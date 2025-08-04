'use client'

import { useGetTocAllNodeList } from '@/views/post-content/hooks/use-get-toc-all-node-list'
import { ContentAsideTocList } from './content-aside-toc-list'
import { ContentProseContent } from './content-prose-content'

interface PostContentContainerProps {
  children: React.ReactNode
}

export const PostContentContainer = ({
  children
}: PostContentContainerProps) => {
  const { contentRef, tocList } = useGetTocAllNodeList('h1, h2')
  return (
    <section className="flex justify-center gap-10 p-4">
      <ContentProseContent ref={contentRef}>{children}</ContentProseContent>
      <ContentAsideTocList tocList={tocList} />
    </section>
  )
}
