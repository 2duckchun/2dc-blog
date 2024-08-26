import { FunctionComponent, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { MarkDownMatter } from '@/types/matter'
import { PostCard } from '../post-card'

interface PostFrontMatterListProps extends HTMLAttributes<HTMLDivElement> {
  list: MarkDownMatter[]
}

export const PostFrontMatterList: FunctionComponent<
  PostFrontMatterListProps
> = ({ className, list, ...props }): JSX.Element => {
  return (
    <section
      className={cn('m-auto flex w-full flex-col gap-3', className)}
      {...props}
    >
      {list.map((item, index) => {
        return <PostCard key={item.title} frontmatter={item} />
      })}
    </section>
  )
}
