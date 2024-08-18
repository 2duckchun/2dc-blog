'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'

interface PostBadgeProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  count?: number
}

export const PostBadge: FunctionComponent<PostBadgeProps> = ({
  className,
  title,
  count,
  ...props
}): JSX.Element => {
  return (
    <Badge className={cn('cursor-pointer', className)} {...props}>
      <span className="text-base">{title}</span>
      {count !== undefined && <span className="ml-2">{count}</span>}
    </Badge>
  )
}
