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
    <section className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
      {/* 좌측 빈공간 - md 이상일 때만 보임 */}
      <div className="hidden md:block" />

      {/* 본문 - 1열 (모바일), 2열 (md 이상) */}
      <div className="col-span-1 md:col-span-2">
        <ContentProseContent ref={contentRef}>{children}</ContentProseContent>
      </div>

      {/* TOC - md 이상일 때만 보임 */}
      <div className="hidden md:block">
        <ContentAsideTocList tocList={tocList} />
      </div>
    </section>
  )
}
