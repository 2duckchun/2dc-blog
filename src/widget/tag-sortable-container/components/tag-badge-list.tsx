'use client'

import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/shared/lib/utils'
import { useMarkdownListContext } from '@/views/home/contexts/use-markdown-list-context'
import { TagBadge } from './tag-badge'

interface TagBadgeListProps extends HTMLAttributes<HTMLDivElement> {}

export const TagBadgeList: FunctionComponent<TagBadgeListProps> = ({
  className,
  ...props
}): JSX.Element => {
  // const taglist = useTagsContext()
  const { markdownList } = useMarkdownListContext()

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-2 flex-wrap my-1 py-2 px-3',
        className
      )}
      {...props}
    >
      {markdownList.map((items) => {
        return (
          <Suspense key={items[0]}>
            <TagBadge title={items[0]} count={items[1].count} />
          </Suspense>
        )
      })}
    </div>
  )
}
