'use client'

import { FunctionComponent, HTMLAttributes, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface PostContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const PostContent: FunctionComponent<PostContentProps> = ({
  className,
  children,
  ...props
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const nodelist = ref.current.querySelectorAll('h1, h2, h3')
      nodelist.forEach((list, idx) => {
        console.dir(`${idx}번째 노드 이름 : ${list.nodeName} id : ${list.id}`)
      })
    }
  }, [])

  return (
    <div ref={ref} className={cn('prose m-auto', className)} {...props}>
      {children}
    </div>
  )
}
