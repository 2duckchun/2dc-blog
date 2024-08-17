'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import Link from 'next/link'
import { useDragElement } from '@/hooks/use-drag-element'
import { useGetTocAllNodeList } from '@/hooks/use-get-toc-all-node-list'
import { useTocHighlightObserver } from '@/hooks/use-toc-highlight-observer'
import { cn } from '@/lib/utils'

interface PostContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const options = {
  root: null,
  threshold: 0
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
    <div ref={contentRef} className={cn('prose m-auto', className)} {...props}>
      <div
        ref={draggableRef}
        id="draggable"
        className="left-3/4 top-[100px] z-10 hidden bg-slate-400 lg:fixed lg:block"
      >
        <div id="draggable-header" className="z-20 cursor-move bg-blue-500 p-5">
          Click here to move
        </div>
        <ul className="list-none">
          {tocList.map((item, idx) => {
            if (item.nodeName === 'H1')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li
                    className={cn(
                      highlightText === item.title && 'text-red-500'
                    )}
                    key={item.title}
                  >
                    {item.title}
                  </li>
                </Link>
              )
            if (item.nodeName === 'H2')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li
                    className={cn(
                      'pl-3',
                      highlightText === item.title && 'text-red-500'
                    )}
                    key={item.title}
                  >
                    {item.title}
                  </li>
                </Link>
              )
            if (item.nodeName === 'H3')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li
                    className={cn(
                      'pl-5',
                      highlightText === item.title && 'text-red-500'
                    )}
                    key={item.title}
                  >
                    {item.title}
                  </li>
                </Link>
              )
          })}
        </ul>
      </div>
      {children}
    </div>
  )
}
