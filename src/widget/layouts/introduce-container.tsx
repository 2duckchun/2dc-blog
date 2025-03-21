import { FunctionComponent, HTMLAttributes } from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'

interface IntroduceContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const IntroduceContainer: FunctionComponent<IntroduceContainerProps> = ({
  className,
  ...props
}): JSX.Element => {
  return (
    <section
      className={cn(
        'w-full bg-slate-400 m-auto h-[200px] bg-[url(/images/cup-of-coffee.jpg)] bg-cover',
        className
      )}
      {...props}
    >
      <div className="container flex h-full">
        <div className="size-[150px] shrink-0 overflow-hidden rounded-full">
          <Image
            src={'/images/profile.png'}
            width={150}
            height={150}
            alt={'프로필 사진'}
          />
        </div>
        <div className="mt-12 text-white">
          <p className="text-3xl font-bold ">2DC Tech</p>
          <p className="text-base underline">덕춘이의 기술 블로그</p>
        </div>
      </div>
    </section>
  )
}
