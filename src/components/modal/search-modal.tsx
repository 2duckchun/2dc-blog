'use client'

import { FunctionComponent, HTMLAttributes, ReactNode } from 'react'
import { Button } from '../ui/button'
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
import { Input } from '../ui/input'

interface SearchModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const SearchModal: FunctionComponent<SearchModalProps> = ({
  className,
  children,
  ...props
}): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90%] rounded-md md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>게시글 검색</DialogTitle>
          <DialogDescription>
            제목 또는 태그명으로 검색해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={'ghost'}>
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
