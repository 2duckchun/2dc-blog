'use client'

import { FunctionComponent, HTMLAttributes, ReactNode, useState } from 'react'
import { getSearchedFrontMatterTitle } from '@/api/search'
import { MarkDownFrontMatter } from '@/types/matter'
import { Button } from '../ui/button'
import { DebouncedInput } from '../ui/debounced-input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'

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
    const data = await getSearchedFrontMatterTitle(String(value))
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
          <DialogTitle>게시글 검색</DialogTitle>
          <DialogDescription>포스트의 제목을 검색해주세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DebouncedInput
            value={''}
            onDebounceHandler={onDebounceHandler}
            debounce={200}
          />
          <div>
            {searchedFrontMatter.map((data, index) => {
              return <div key={data.title}>{data.title}</div>
            })}
          </div>
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
