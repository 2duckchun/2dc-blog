import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/lib/utils'
import { MarkDownFrontMatter } from '@/types/matter'
import { PostCard } from '../post-card'

interface PostFrontMatterListProps extends HTMLAttributes<HTMLDivElement> {
  list: MarkDownFrontMatter[]
}

export const PostFrontMatterList: FunctionComponent<
  PostFrontMatterListProps
> = ({ className, list, ...props }): JSX.Element => {
  return (
    <section
      className={cn('m-auto flex w-full flex-col gap-5', className)}
      {...props}
    >
      {list.map((item, index) => {
        return (
          <Suspense key={item.title}>
            <PostCard frontmatter={item} />
          </Suspense>
        )
      })}
    </section>
  )
}
