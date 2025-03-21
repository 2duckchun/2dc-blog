import { FunctionComponent, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { TagsDetailPost } from '@/types/tags'
import { TagBadgeList } from './components/tag-badge-list'
import { TagsContextProvider } from './contexts/tags-provider'
import { TagSortedPostList } from './tag-sorted-post-list'

interface TagSortableContainerProps extends HTMLAttributes<HTMLDivElement> {
  parsedTagList: [string, TagsDetailPost][]
}

export const TagSortableContainer: FunctionComponent<
  TagSortableContainerProps
> = ({ className, parsedTagList, ...props }): JSX.Element => {
  return (
    <TagsContextProvider taglist={parsedTagList}>
      <section className={cn(className)} {...props}>
        <TagBadgeList />
        <TagSortedPostList />
      </section>
    </TagsContextProvider>
  )
}
