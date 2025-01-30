'use client'

import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { TagBadge } from './tag-badge'
import { useTagsContext } from './tags-provider'

interface TagBadgeListProps extends HTMLAttributes<HTMLDivElement> {}

export const TagBadgeList: FunctionComponent<TagBadgeListProps> = ({
  className,
  ...props
}): JSX.Element => {
  const taglist = useTagsContext()

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center border-l-8 border-r-8 border-t-2 border-b-2 gap-2 overflow-x-auto my-1 py-2 px-3 bg-slate-50',
        className
      )}
    >
      {taglist.map((items) => {
        return (
          <Suspense key={items[0]}>
            <TagBadge title={items[0]} count={items[1].count} />
          </Suspense>
        )
      })}
    </div>
  )
}
