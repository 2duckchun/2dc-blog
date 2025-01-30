import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { TagsDetailPost } from '@/types/tags'
import { TagBadgeList } from './tag-badge-list'
import { TagSortedPostList } from './tag-sorted-post-list'
import { TagsContextProvider } from './tags-provider'

interface TagSortableContainerProps extends HTMLAttributes<HTMLDivElement> {
  parsedTagList: [string, TagsDetailPost][]
}

export const TagSortableContainer: FunctionComponent<
  TagSortableContainerProps
> = ({ className, parsedTagList, ...props }): JSX.Element => {
  return (
    <Suspense>
      <section className={cn(className)} {...props}>
        <TagsContextProvider taglist={parsedTagList}>
          <TagBadgeList />
          <TagSortedPostList />
        </TagsContextProvider>
      </section>
    </Suspense>
  )
}
