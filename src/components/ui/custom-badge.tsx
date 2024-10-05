'use client'

import {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useRef,
  useState
} from 'react'
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
  const { setQuertString, getQueryString } = useQueryStringController()
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
      aria-selected={isSelected}
      className={cn(
        'flex w-fit bg-white cursor-pointer items-center py-1 px-2 justify-center rounded-[15px] border-2 border-gray-200 aria-selected:border-r-gray-400 aria-selected:border-b-gray-400 aria-selected:font-semibold',
        className
      )}
      onClick={(e) => {
        e.preventDefault()
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
