'use client'

import {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useRef,
  useState
} from 'react'
import { useQueryParams } from '@/shared/hooks/use-query-params'
import { cn } from '@/shared/lib/utils'
import { scrollToTop } from '../lib/scroll-to-top'

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
  const { setQuertString, getQueryString } = useQueryParams()
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const tagQueryString = getQueryString('tag')
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (title === tagQueryString) setIsSelected(true)
    else setIsSelected(false)
  }, [tagQueryString, title])

  return (
    <div
      ref={badgeRef}
      role="tab"
      aria-selected={isSelected}
      className={cn(
        'flex w-fit bg-white cursor-pointer items-center py-1 px-3 justify-center rounded-[15px] border-[1px] border-gray-200',
        'aria-selected:bg-navy-500 aria-selected:text-white aria-selected:font-semibold',
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        scrollToTop()
        setQuertString({
          tag: title
        })
      }}
      {...props}
    >
      <span className="w-full whitespace-nowrap text-xs md:text-base">
        {title}
      </span>
      {count !== undefined && <span className="ml-2 text-xs">{count}</span>}
    </div>
  )
}
