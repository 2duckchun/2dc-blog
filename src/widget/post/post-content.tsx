'use client'

import { FunctionComponent, HTMLAttributes, useMemo } from 'react'
import { scrollToHeadingById } from '@/shared/lib/scroll-helper'
import { cn } from '@/shared/lib/utils'
import { useGetTocAllNodeList } from '@/widget/post/hooks/use-get-toc-all-node-list'
import { useTocHighlightByScroll } from '@/widget/post/hooks/use-toc-highlight-by-scroll'

interface PostContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const PostContent: FunctionComponent<PostContentProps> = ({
  className,
  children,
  ...props
}): JSX.Element => {
  const { contentRef, tocList } = useGetTocAllNodeList('h1, h2')
  const { highlightedId } = useTocHighlightByScroll(tocList)
  const itemHeight = 30
  const highlightedIndex = useMemo(
    () => tocList.findIndex((toc) => toc.id === highlightedId),
    [tocList, highlightedId]
  )

  return (
    <section className="flex justify-center gap-10 p-4">
      <div ref={contentRef} className={cn('prose', className)} {...props}>
        {children}
      </div>
      <aside className="sticky top-40 w-[250px] flex-none self-start">
        <div className="relative pl-4">
          {/* 회색 전체 바 */}
          <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />

          {/* 파란색 이동 바 */}
          {highlightedIndex >= 0 && (
            <div
              className="absolute left-0 w-[2px] bg-blue-500 transition-transform duration-300"
              style={{
                transform: `translateY(${highlightedIndex * itemHeight}px)`,
                height: `${itemHeight}px`
              }}
            />
          )}
          <ul className="text-sm">
            {tocList.map((toc) => (
              <li key={toc.id} className="flex h-[30px] items-center">
                <a
                  href={`#${toc.id}`}
                  className={cn(
                    'transition-all duration-300 ease-in-out',
                    highlightedId === toc.id
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-500'
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToHeadingById(toc.id)
                  }}
                >
                  {toc.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  )
}
