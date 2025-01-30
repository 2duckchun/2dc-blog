import { FunctionComponent, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface HomeViewProps extends HTMLAttributes<HTMLDivElement> {}

export const HomeView: FunctionComponent<HomeViewProps> = ({
  className,
  ...props
}): JSX.Element => {
  return (
    <main
      className={cn(
        'm-auto flex min-h-screen max-w-screen-xl flex-col gap-5 p-2 px-6 md:p-24 md:py-6',
        className
      )}
      {...props}
    >
      HomeView
    </main>
  )
}
