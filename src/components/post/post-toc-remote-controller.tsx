import { forwardRef, HTMLAttributes } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TocData } from '@/types/post'

interface PostTocRemoteControllerProps extends HTMLAttributes<HTMLDivElement> {
  highlightText: string
  tocList: TocData[]
}

export const PostTocRemoteController = forwardRef(
  (
    { highlightText, tocList }: PostTocRemoteControllerProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        id="draggable"
        className="left-3/4 top-[100px] z-10 hidden overflow-hidden rounded-md shadow-md lg:fixed lg:block"
      >
        <div
          id="draggable-header"
          className="z-20 cursor-move border-b-2 bg-slate-300 px-5 py-4"
        >
          Click here to move
        </div>
        <ul className="list-none px-4">
          {tocList.map((item, idx) => {
            if (item.nodeName === 'H1')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li className={cn('text-lg font-semibold')} key={item.title}>
                    {item.title}
                  </li>
                </Link>
              )
            if (item.nodeName === 'H2')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li
                    className={cn(
                      'pl-3',
                      highlightText === item.title && 'text-red-500'
                    )}
                    key={item.title}
                  >
                    {item.title}
                  </li>
                </Link>
              )
            if (item.nodeName === 'H3')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li
                    className={cn(
                      'pl-5',
                      highlightText === item.title && 'text-red-500'
                    )}
                    key={item.title}
                  >
                    {item.title}
                  </li>
                </Link>
              )
          })}
        </ul>
      </div>
    )
  }
)

PostTocRemoteController.displayName = 'PostTocRemoteController'
