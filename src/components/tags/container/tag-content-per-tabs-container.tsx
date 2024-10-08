'use client'

import { Fragment, FunctionComponent, HTMLAttributes } from 'react'
import { PostFrontMatterList } from '@/components/post/container/post-front-matter-list'
import { useQueryParams } from '@/hooks/use-query-params'
import { cn } from '@/lib/utils'
import { useTagsContext } from '@/providers/tags-provider'

interface TagContentPerTabsContainerProps
  extends HTMLAttributes<HTMLDivElement> {}

export const TagContentPerTabsContainer: FunctionComponent<
  TagContentPerTabsContainerProps
> = ({ className, ...props }): JSX.Element => {
  const taglist = useTagsContext()
  const currentTag = useQueryParams().getQueryString('tag') ?? 'all'
  return (
    <div className={cn(className)} {...props}>
      <div className="m-auto flex w-full flex-col gap-3">
        {taglist.map((item) => {
          if (currentTag === item[0]) {
            return (
              <Fragment key={item[0]}>
                <PostFrontMatterList list={item[1].frontMatter} />
              </Fragment>
            )
          }
        })}
      </div>
    </div>
  )
}
