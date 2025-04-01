'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import { useDragElement } from '@/shared/hooks/use-drag-element'
import { useGetTocAllNodeList } from '@/shared/hooks/use-get-toc-all-node-list'
import { useTocHighlightObserver } from '@/shared/hooks/use-toc-highlight-observer'
import { cn } from '@/shared/lib/utils'
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
  const { higtlightTextObject } = useTocHighlightObserver(contentRef)

  return (
    <>
      <div
        ref={contentRef}
        className={cn('prose m-auto p-4', className)}
        {...props}
      >
        {children}
      </div>
      <PostTocRemoteController
        ref={draggableRef}
        higtlightTextObject={higtlightTextObject}
        tocList={tocList}
      />
    </>
  )
}
