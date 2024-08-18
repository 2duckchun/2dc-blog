import { FunctionComponent, HTMLAttributes } from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MarkDownMatter } from '@/types/matter'
import { Badge } from '../ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'

interface PostCardProps extends HTMLAttributes<HTMLDivElement> {
  frontmatter: MarkDownMatter
}

const parseFilePath = (fileName: MarkDownMatter['fileName']) => {
  if (Array.isArray(fileName)) {
    return fileName.join('/')
  }
  return fileName
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
    <Link className="w-full" href={`/${parseFilePath(frontmatter.fileName)}`}>
      <Card
        key={frontmatter.title}
        className={cn(
          'w-full p-3 flex cursor-pointer transition hover:outline hover:translate-x-4',
          className
        )}
      >
        <div className="hidden sm:flex sm:min-w-[250px] sm:justify-center">
          <Image
            src={frontmatter.thumbnail}
            width={250}
            height={200}
            className="rounded-lg"
            alt={frontmatter.title}
          />
        </div>
        <div>
          <CardHeader>
            <CardTitle>{frontmatter.title}</CardTitle>
            <CardDescription>{CREATED_TIME}</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div>{frontmatter.description}</div>
            <div className="flex flex-wrap gap-1 pt-5">
              {frontmatter.tags.map((item, index) => {
                return <Badge key={item}>{item}</Badge>
              })}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
