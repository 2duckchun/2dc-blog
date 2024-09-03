'use client'

import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { useTagsContext } from '@/providers/tags-provider'
import { TagBadge } from '../tag-badge'

interface TagBadgeListProps extends HTMLAttributes<HTMLDivElement> {}

export const TagBadgeList: FunctionComponent<TagBadgeListProps> = ({
  className,
  ...props
}): JSX.Element => {
  const taglist = useTagsContext()

  return (
    <div className={cn('flex gap-3', className)}>
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
