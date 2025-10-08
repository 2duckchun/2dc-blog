'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { TocData } from '@/domain/post/schema/toc'
import { scrollToHeadingById } from '@/shared/lib/scroll-helper'
import { cn } from '@/shared/lib/utils'
import { useTocHighlightByScroll } from '@/views/post-content/hooks/use-toc-highlight-by-scroll'

interface ContentAsideTocListProps {
  tocList: TocData[]
}

const levelIndentClass = (nodeName?: string) => {
  switch (nodeName) {
    case 'H1':
      return 'pl-0'
    case 'H2':
      return 'pl-2'
    case 'H3':
      return 'pl-5'
    default:
      return 'pl-6'
  }
}
const levelTextClass = (nodeName?: string) => {
  switch (nodeName) {
    case 'H1':
      return 'text-md'
    case 'H2':
      return 'text-sm'
    case 'H3':
      return 'text-sm'
    default:
      return 'text-[13px]'
  }
}

export const ContentAsideTocList = ({ tocList }: ContentAsideTocListProps) => {
  const { highlightedId } = useTocHighlightByScroll(tocList)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const [barPos, setBarPos] = useState({ top: 0, height: 0 })

  // 한 프레임 늦춰서 각 li 위치 계산
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      const container = containerRef.current
      if (!container) return
      const baseTop = container.getBoundingClientRect().top
      const current = itemRefs.current[highlightedId!]
      if (!current) return
      const rect = current.getBoundingClientRect()
      setBarPos({ top: rect.top - baseTop, height: rect.height })
    })
  }, [highlightedId, tocList])

  return (
    <aside className="sticky top-40 w-[250px] flex-none self-start">
      <div ref={containerRef} className="relative pl-4">
        {/* 회색 바 */}
        <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-200" />
        {/* 파란 바 */}
        {highlightedId && (
          <div
            className="absolute left-0 top-0 w-[2px] bg-blue-500 transition-transform duration-300"
            style={{
              transform: `translateY(${barPos.top}px)`,
              height: `${barPos.height}px`
            }}
          />
        )}

        <ul className="space-y-0.5">
          {tocList.map((toc) => (
            <li
              key={toc.id}
              ref={(el) => {
                itemRefs.current[toc.id] = el
              }}
              className="flex"
            >
              <a
                href={`#${toc.id}`}
                className={cn(
                  'leading-6 transition-all pt-[2px] duration-200 ease-in-out whitespace-normal break-keep',
                  levelIndentClass(toc.nodeName),
                  levelTextClass(toc.nodeName),
                  highlightedId === toc.id
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
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
