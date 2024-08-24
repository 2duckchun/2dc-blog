'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const pushRouteWithNewQueryString = (name: string, value: string) => {
    const currentURLSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    )
    currentURLSearchParams.set(name, value)
    const current = currentURLSearchParams.toString()
    const query = current ? `?${current}` : ''
    router.push(`${pathname}${query}`)
  }

  return (
    <Badge
      className={cn('cursor-pointer', className)}
      {...props}
      onClick={() => pushRouteWithNewQueryString('tag', title)}
    >
      <span className="text-base">{title}</span>
      {count !== undefined && <span className="ml-2">{count}</span>}
    </Badge>
  )
}
