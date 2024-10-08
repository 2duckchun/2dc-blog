'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import { useQueryParams } from '@/hooks/use-query-params'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

interface TagBadgeProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  count?: number
}

export const TagBadge: FunctionComponent<TagBadgeProps> = ({
  className,
  title,
  count,
  ...props
}): JSX.Element => {
  const { setQuertString } = useQueryParams()

  return (
    <Badge
      className={cn('cursor-pointer', className)}
      {...props}
      onClick={() =>
        setQuertString({
          tag: title
        })
      }
    >
      <span className="text-xs md:text-base">{title}</span>
      {count !== undefined && <span className="ml-2">{count}</span>}
    </Badge>
  )
}
