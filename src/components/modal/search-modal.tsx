'use client'

import { FunctionComponent, HTMLAttributes, ReactNode } from 'react'
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
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <DialogClose asChild>
            <button type="button">Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
