'use client'

import { Fragment, FunctionComponent, HTMLAttributes } from 'react'
import { PostCard } from '@/components/post/post-card'
import { useQueryStringController } from '@/hooks/use-query-string-controller'
import { cn } from '@/lib/utils'
import { useTagsContext } from '@/providers/tags-provider'

interface TagContentPerTabsContainerProps
  extends HTMLAttributes<HTMLDivElement> {}

export const TagContentPerTabsContainer: FunctionComponent<
  TagContentPerTabsContainerProps
> = ({ className, ...props }): JSX.Element => {
  const taglist = useTagsContext()
  const currentTag = useQueryStringController().getQueryString('tag') ?? 'all'
  return (
    <div className={cn(className)} {...props}>
      <div className="m-auto flex w-full flex-col gap-3">
        {taglist.map((item) => {
          if (currentTag === item[0]) {
            return (
              <Fragment key={item[0]}>
                {item[1].frontMatter.map((frontmatter) => (
                  <PostCard frontmatter={frontmatter} key={frontmatter.title} />
                ))}
              </Fragment>
            )
          }
        })}
      </div>
    </div>
  )
}