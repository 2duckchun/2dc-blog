'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import { useDragElement } from '@/hooks/use-drag-element'
import { useGetTocAllNodeList } from '@/hooks/use-get-toc-all-node-list'
import { useTocHighlightObserver } from '@/hooks/use-toc-highlight-observer'
import { cn } from '@/lib/utils'
import { PostTocRemoteController } from './post-toc-remote-controller'

interface PostContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const PostContent: FunctionComponent<PostContentProps> = ({
  className,
  children,
  ...props
}): JSX.Element => {
  const draggableRef = useDragElement()
  const { contentRef, tocList } = useGetTocAllNodeList('h1, h2, h3')
  const { highlightText } = useTocHighlightObserver(contentRef)

  return (
    <div
      ref={contentRef}
      className={cn('prose m-auto py-4', className)}
      {...props}
    >
      <PostTocRemoteController
        ref={draggableRef}
        highlightText={highlightText}
        tocList={tocList}
      />
      {children}
    </div>
  )
}
