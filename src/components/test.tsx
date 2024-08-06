'use client'

import { FunctionComponent, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface testProps extends React.HTMLAttributes<HTMLDivElement> {
  //   children: ReactElement<any, string | JSXElementConstructor<any>>
  children: React.ReactNode
}

export const Test: FunctionComponent<testProps> = ({
  className,
  children,
  ...props
}) => {
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
