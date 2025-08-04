'use client'

import { useMemo } from 'react'
import { scrollToHeadingById } from '@/shared/lib/scroll-helper'
import { cn } from '@/shared/lib/utils'
import { TocData } from '@/domain/post/schema/toc'
import { useTocHighlightByScroll } from '@/views/post-content/hooks/use-toc-highlight-by-scroll'

interface ContentAsideTocListProps {
  tocList: TocData[]
}

export const ContentAsideTocList = ({ tocList }: ContentAsideTocListProps) => {
  const { highlightedId } = useTocHighlightByScroll(tocList)
  const itemHeight = 30
  const highlightedIndex = useMemo(
    () => tocList.findIndex((toc) => toc.id === highlightedId),
    [tocList, highlightedId]
  )
  return (
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
  )
}
