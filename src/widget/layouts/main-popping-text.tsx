import { FunctionComponent, HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

interface MainPoppingTextProps extends HTMLAttributes<HTMLDivElement> {}

export const MainPoppingText: FunctionComponent<MainPoppingTextProps> = ({
  className,
  ...props
}): JSX.Element => {
  return (
    <div className={cn(className)} {...props}>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[100ms] md:text-[50px]">
        C
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[200ms] md:text-[50px]">
        O
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[300ms] md:text-[50px]">
        D
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[400ms] md:text-[50px]">
        E
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[500ms] md:text-[50px]">
        _
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[600ms] md:text-[50px]">
        A
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[700ms] md:text-[50px]">
        R
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[800ms] md:text-[50px]">
        C
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[900ms] md:text-[50px]">
        H
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[1000ms] md:text-[50px]">
        i
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[1100ms] md:text-[50px]">
        V
      </span>
      <span className="relative inline-block animate-bounce-bounce text-[25px] text-shadow-bounce animation-delay-[1200ms] md:text-[50px]">
        E
      </span>
    </div>
  )
}
