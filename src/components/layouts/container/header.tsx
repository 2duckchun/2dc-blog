'use client'

import { FunctionComponent, useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { TopNavigationMenu } from '@/components/layouts/top-navigation-menu'
import { cn } from '@/lib/utils'

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header: FunctionComponent<HeaderProps> = ({
  className,
  ...props
}) => {
  return (
    <header
      className={cn('sticky bg-white z-50 top-0 shadow-md', className)}
      {...props}
    >
      <DesktopHeader />
      <MobileHeader />
    </header>
  )
}

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="md:hidden">
      <section className="flex h-header w-full items-center justify-between px-6 md:hidden">
        <HeadingLogo />
        <Menu
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        />
      </section>
      {isOpen && <TopNavigationMenu className="flex-col gap-3 pb-5" />}
    </div>
  )
}

const DesktopHeader = () => {
  return (
    <section className="m-auto hidden h-header w-full items-center justify-between px-6 md:flex xl:w-[1280px]">
      <HeadingLogo />
      <TopNavigationMenu />
    </section>
  )
}

const HeadingLogo = () => {
  return (
    <Link href={'/'}>
      <h1 className="text-xl font-bold xl:text-2xl">2DC BLOG</h1>
    </Link>
  )
}
