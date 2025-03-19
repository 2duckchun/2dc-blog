import { forwardRef, HTMLAttributes } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TocData } from '@/types/post'

interface PostTocRemoteControllerProps extends HTMLAttributes<HTMLDivElement> {
  higtlightTextObject: Record<string, any>
  tocList: TocData[]
}

export const PostTocRemoteController = forwardRef(
  (
    { higtlightTextObject, tocList }: PostTocRemoteControllerProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        id="draggable"
        className="left-[76%] top-[280px] z-10 hidden min-w-[300px] overflow-hidden rounded-md bg-white shadow-md lg:fixed lg:block"
      >
        <div
          id="draggable-header"
          className="z-20 cursor-move border-b-2 bg-slate-300 px-5 py-4"
        >
          Click here to move
        </div>
        <ul className="flex list-none flex-col gap-2 px-4 py-3">
          {tocList.map((item) => (
            <TocListItem
              key={item.title}
              higtlightTextObject={higtlightTextObject}
              tocData={item}
            />
          ))}
        </ul>
      </div>
    )
  }
)

PostTocRemoteController.displayName = 'PostTocRemoteController'

const TocListItem = ({
  tocData,
  higtlightTextObject
}: {
  tocData: TocData
  higtlightTextObject: Record<string, any>
}) => {
  const data = higtlightTextObject.current[tocData.title]

  const styles =
    tocData.nodeName === 'H1'
      ? 'text-lg font-semibold'
      : tocData.nodeName === 'H2'
        ? 'pl-3'
        : `pl-5 before:content-['-'] before:pr-2`

  return (
    <Link href={`#${tocData.id}`} key={tocData.id}>
      <li className={cn(styles, data && 'text-blue-700')} key={tocData.title}>
        {tocData.title}
      </li>
    </Link>
  )
}
