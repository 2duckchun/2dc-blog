import { FunctionComponent, HTMLAttributes } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MarkDownMatter } from '@/types/matter'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'

interface PostCardProps extends HTMLAttributes<HTMLDivElement> {
  frontmatter: MarkDownMatter
}

export const PostCard: FunctionComponent<PostCardProps> = ({
  className,
  frontmatter,
  ...props
}): JSX.Element => {
  const CREATED_TIME = dayjs(frontmatter.created_date).format(
    'YYYY년 MM월 DD일'
  )

  return (
    <Link className="w-fit" href={`/post/${frontmatter.fileName}`}>
      <Card
        key={frontmatter.title}
        className={cn(
          'w-full md:w-[350px] cursor-pointer transition hover:-translate-y-3',
          className
        )}
      >
        <CardHeader>
          <CardTitle>{frontmatter.title}</CardTitle>
          <CardDescription>{CREATED_TIME}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full justify-center py-5">
            <Image
              src={frontmatter.thumbnail}
              width={250}
              height={200}
              className="rounded-lg"
              alt={frontmatter.title}
            />
          </div>
          <div>{frontmatter.description}</div>
          <div className="flex gap-1">
            {frontmatter.tags.map((item, index) => {
              return <Badge key={item}>{item}</Badge>
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
