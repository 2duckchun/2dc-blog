import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import { cn } from '@/shared/lib/utils'
import { MarkDownFrontMatter } from '@/types/matter'
import { PostIntroCard } from '../post-intro-card/post-intro-card'

interface PostFrontMatterListProps extends HTMLAttributes<HTMLDivElement> {
  list: MarkDownFrontMatter[]
}

export const PostFrontMatterList: FunctionComponent<
  PostFrontMatterListProps
> = ({ className, list, ...props }): JSX.Element => {
  return (
    <section
      className={cn('m-auto flex w-full flex-col gap-5 my-4', className)}
      {...props}
    >
      {list.map((item, index) => {
        return (
          <Suspense key={item.title}>
            <PostIntroCard frontmatter={item} />
          </Suspense>
        )
      })}
    </section>
  )
}
