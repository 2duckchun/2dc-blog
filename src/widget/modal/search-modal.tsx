'use client'

import {
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  Suspense,
  useState
} from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import { searchMarkdownFrontMatterInServerFile } from '@/domain/markdown/actions/search-markdown-front-matter-in-server-file'
import { parseFilePath } from '@/shared/lib/path-helper'
import { cn } from '@/shared/lib/utils'
import { TagBadge } from '@/shared/ui/tag-badge'
import { MarkDownFrontMatter } from '@/domain/markdown/schema/markdown'
import { Button } from '../../shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../shared/ui/card'
import { DebouncedInput } from '../../shared/ui/debounced-input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../shared/ui/dialog'

interface SearchModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const SearchModal: FunctionComponent<SearchModalProps> = ({
  className,
  children,
  ...props
}): JSX.Element => {
  const [searchedFrontMatter, setSearchedFrontMatter] = useState<
    MarkDownFrontMatter[]
  >([])

  const resetSearchFrontMatter = () => {
    setSearchedFrontMatter([])
  }

  const onDebounceHandler = async (value: string | number) => {
    const data = await searchMarkdownFrontMatterInServerFile(String(value))
    setSearchedFrontMatter(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-[90%] rounded-md md:max-w-[800px]"
        onCloseHandler={resetSearchFrontMatter}
      >
        <DialogHeader>
          <DialogTitle>포스트 검색</DialogTitle>
          <DialogDescription>포스트의 제목을 검색해주세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* 검색 Input */}
          <DebouncedInput
            value={''}
            onDebounceHandler={onDebounceHandler}
            debounce={200}
          />
          {/* 검색 품목 리스트렌더링 */}
          <SearchedPostList searchedFrontMatter={searchedFrontMatter} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={resetSearchFrontMatter}
              type="button"
              variant={'ghost'}
            >
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const SearchedPostList = ({
  searchedFrontMatter,
  className
}: {
  searchedFrontMatter: MarkDownFrontMatter[]
  className?: string
}) => {
  return (
    <div className="flex flex-col gap-3">
      {searchedFrontMatter.map((item, index) => {
        const CREATED_TIME = dayjs(item.created_date).format('YYYY년 MM월 DD일')
        return (
          <Link
            key={item.title}
            className="w-full"
            href={`/${parseFilePath(item.fileName)}`}
          >
            <Card
              key={item.title}
              className={cn(
                'w-full flex cursor-pointer transition hover:outline hover:translate-x-4',
                className
              )}
            >
              <div className="w-full">
                <CardHeader className="justify-between md:flex-row">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{CREATED_TIME}</CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                  <div className="flex flex-wrap justify-end gap-1 pt-1">
                    {item.tags.map((item) => {
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
      })}
    </div>
  )
}
