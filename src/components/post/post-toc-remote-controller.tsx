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
        className="left-3/4 top-[100px] z-10 hidden bg-slate-400 lg:fixed lg:block"
      >
        <div id="draggable-header" className="z-20 cursor-move bg-blue-500 p-5">
          Click here to move
        </div>
        <ul className="list-none">
          {tocList.map((item, idx) => {
            if (item.nodeName === 'H1')
              return (
                <Link href={`#${item.id}`} key={item.id}>
                  <li
                    className={cn(
                      highlightText === item.title && 'text-red-500'
                    )}
                    key={item.title}
                  >
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
