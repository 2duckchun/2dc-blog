'use client'

import { FunctionComponent, HTMLAttributes, useEffect, useRef } from 'react'
import { useQueryStringController } from '@/hooks/use-query-string-controller'
import { cn } from '@/lib/utils'

interface CustomBadgeProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  count?: number
}

export const CustomBadge: FunctionComponent<CustomBadgeProps> = ({
  className,
  title,
  count,
  ...props
}): JSX.Element => {
  const { setQuertString } = useQueryStringController()

  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const badges = document.querySelectorAll<HTMLDivElement>('#custom-badge')
    badges.forEach((badge) => {
      badge.addEventListener('click', () => {
        badges.forEach((badge) => badge.setAttribute('aria-selected', 'false'))
        badge.setAttribute('aria-selected', 'true')
      })
    })
  }, [])

  return (
    <div
      ref={badgeRef}
      id={'custom-badge'}
      className={cn(
        'flex w-fit items-center py-1 px-2 justify-center rounded-[10px] border-2 border-gray-200 aria-selected:border-r-gray-400 aria-selected:border-b-gray-400 aria-selected:font-semibold',
        className
      )}
      onClick={() =>
        setQuertString({
          tag: title
        })
      }
      {...props}
    >
      <span className="w-full whitespace-nowrap text-xs md:text-base">
        {title}
      </span>
      {count !== undefined && <span className="ml-2">{count}</span>}
    </div>
  )
}
