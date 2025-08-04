'use client'

import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/shared/lib/utils'
import { TagBadge } from '@/shared/ui/tag-badge'
import { useMarkdownListContext } from '../../contexts/use-markdown-list-context'

interface TagBadgeListProps extends HTMLAttributes<HTMLDivElement> {}

export const TagBadgeList: FunctionComponent<TagBadgeListProps> = ({
  className,
  ...props
}): JSX.Element => {
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
