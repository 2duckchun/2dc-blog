'use client'

import { Fragment, FunctionComponent, HTMLAttributes } from 'react'
import { useQueryParams } from '@/shared/hooks/use-query-params'
import { cn } from '@/shared/lib/utils'
import { PostFrontMatterList } from '@/widget/post/post-front-matter-list'
import { useMarkdownListContext } from '../../contexts/use-markdown-list-context'

interface TagSortedPostListProps extends HTMLAttributes<HTMLDivElement> {}

export const TagSortedPostList: FunctionComponent<TagSortedPostListProps> = ({
  className,
  ...props
}): JSX.Element => {
  const { markdownList } = useMarkdownListContext()
  const currentTag = useQueryParams().getQueryString('tag') ?? 'all'

  return (
    <section className={cn(className)} {...props}>
      <div className="m-auto flex w-full flex-col gap-3">
        {markdownList.map((item) => {
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
