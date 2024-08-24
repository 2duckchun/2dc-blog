'use client'

import { FunctionComponent, HTMLAttributes } from 'react'
import { useQueryStringController } from '@/hooks/use-query-string-controller'
import { cn } from '@/lib/utils'

interface PostContentPerTabsProps extends HTMLAttributes<HTMLDivElement> {}

export const TagContentPerTabs: FunctionComponent<PostContentPerTabsProps> = ({
  className,
  ...props
}): JSX.Element => {
  const currentTag = useQueryStringController().getQueryString('tag')
  return (
    <div className={cn(className)} {...props}>
      PostContentPerTabs
      <p>{currentTag}</p>
    </div>
  )
}
