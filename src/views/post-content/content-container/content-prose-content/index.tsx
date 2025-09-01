import { forwardRef, HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

interface ContentProseContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ContentProseContent = forwardRef<
  HTMLDivElement,
  ContentProseContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('prose mx-auto', className)} {...props}>
      {children}
    </div>
  )
})

ContentProseContent.displayName = 'ContentProseContent'
