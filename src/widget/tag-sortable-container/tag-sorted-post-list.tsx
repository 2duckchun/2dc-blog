'use client'

import { Fragment, FunctionComponent, HTMLAttributes } from 'react'
import { useQueryParams } from '@/hooks/use-query-params'
import { cn } from '@/lib/utils'
import { PostFrontMatterList } from '../post/post-front-matter-list'
import { useTagsContext } from './tags-provider'

interface TagSortedPostListProps extends HTMLAttributes<HTMLDivElement> {}

export const TagSortedPostList: FunctionComponent<TagSortedPostListProps> = ({
  className,
  ...props
}): JSX.Element => {
  const taglist = useTagsContext()
  const currentTag = useQueryParams().getQueryString('tag') ?? 'all'
  return (
    <section className={cn(className)} {...props}>
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
    </section>
  )
}
