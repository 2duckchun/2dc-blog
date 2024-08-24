'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
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
          <TagBadge key={items[0]} title={items[0]} count={items[1].count} />
        )
      })}
    </div>
  )
}
