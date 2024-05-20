'use client'

import { FunctionComponent, useState } from 'react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavigationMenuDemo } from './HeaderMenu'

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header: FunctionComponent<HeaderProps> = ({
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className={cn('sticky bg-white z-50 top-0 shadow-md', className)}
      {...props}
    >
      <DesktopHeader />
      <div>
        <section className="flex h-header w-full items-center justify-between px-6 md:hidden">
          <h1 className="text-xl font-bold">토종스크립트</h1>
          <Menu
            className="cursor-pointer"
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          />
        </section>
        {isOpen && (
          <div className="bg-white p-3">
            <div className="w-full rounded-lg bg-slate-400 px-3 pb-3 text-center">
              <p className="py-2">커리큘럼</p>
              <ul className="flex flex-col gap-1 rounded-lg bg-white">
                <li className="m-auto flex h-10 w-[95%] cursor-pointer items-center justify-center hover:bg-slate-50">
                  초급
                </li>
                <li className="m-auto flex h-10 w-[95%] cursor-pointer items-center justify-center hover:bg-slate-50">
                  중급
                </li>
                <li className="m-auto flex h-10 w-[95%] cursor-pointer items-center justify-center hover:bg-slate-50">
                  고급
                </li>
              </ul>
            </div>
            <div>아카이브</div>
            <div>MDN</div>
          </div>
        )}
      </div>
    </header>
  )
}

const DesktopHeader = () => {
  return (
    <section className="m-auto hidden h-header w-full items-center justify-between px-6 md:flex xl:w-[1280px]">
      <div className="w-1/3">
        <h1 className="text-2xl font-bold">토종스크립트</h1>
      </div>
      <div className="flex w-1/3 justify-center">
        <NavigationMenuDemo />
      </div>
      <div className="flex w-1/3 justify-end">로그인</div>
    </section>
  )
}
