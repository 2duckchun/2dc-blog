import { FunctionComponent, HTMLAttributes, Suspense } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { MarkDownFrontMatter } from '@/domain/markdown/schema/markdown'
import { parseFilePath } from '@/shared/lib/path-helper'
import { cn } from '@/shared/lib/utils'
import { TagBadge } from '@/shared/ui/tag-badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../../../shared/ui/card'

interface PostIntroCardProps extends HTMLAttributes<HTMLDivElement> {
  frontmatter: MarkDownFrontMatter
}

export const PostIntroCard: FunctionComponent<PostIntroCardProps> = ({
  className,
  frontmatter,
  ...props
}): JSX.Element => {
  const CREATED_TIME = dayjs(frontmatter.created_date).format(
    'YYYY년 MM월 DD일'
  )

  return (
    <Link className="w-full" href={`/${parseFilePath(frontmatter.fileName)}`}>
      <Card
        key={frontmatter.title}
        className={cn(
          'w-full p-1 md:p-4 flex cursor-pointer transition hover:outline hover:scale-105',
          className
        )}
      >
        <div className="hidden items-center sm:flex sm:justify-center">
          <div className="relative size-[150px]">
            <Image
              src={frontmatter.thumbnail || '/images/note.jpg'}
              fill
              unoptimized
              className="rounded-lg"
              alt={frontmatter.title}
            />
          </div>
        </div>

        <div>
          <CardHeader className="py-2">
            <CardTitle className="text-base md:text-xl">
              {frontmatter.title}
            </CardTitle>
            <CardDescription>{CREATED_TIME}</CardDescription>
          </CardHeader>
          <CardContent className="w-full py-2">
            <div>{frontmatter.description}</div>
            <div role="tablist" className="flex flex-wrap gap-1 pt-3 md:pt-5">
              {frontmatter.tags.map((item) => {
                return (
                  <Suspense key={item}>
                    <TagBadge title={item} />
                  </Suspense>
                )
              })}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
