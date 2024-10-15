import { FunctionComponent, HTMLAttributes } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MainPoppingText } from '../main-popping-text'

interface IntroduceContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const IntroduceContainer: FunctionComponent<IntroduceContainerProps> = ({
  className,
  ...props
}): JSX.Element => {
  return (
    <section
      className={cn(
        'w-full md:w-[90%] my-5 flex flex-col md:flex-row items-center gap-5',
        className
      )}
      {...props}
    >
      <div className="size-[150px] shrink-0 overflow-hidden rounded-full">
        <Image
          src={'/images/profile.png'}
          width={150}
          height={150}
          alt={'프로필 사진'}
        />
      </div>
      <div>
        <MainPoppingText className="my-5 flex w-full gap-2" />
        <p>안녕하세요.</p>
        <p>개발자 2duckchun의 블로그입니다.</p>
      </div>
    </section>
  )
}
