'use client'

import { ReactNode } from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_PATH } from '@/shared/constants/app-path'
import { cn } from '@/shared/lib/utils'
import { SearchModal } from '../modal/search-modal'

interface TopNavigationMenuProps {
  className?: string
}

const TOP_NAVIGATION_LIST = [
  {
    title: (
      <Image src={'/icons/github.svg'} alt="github" width={40} height={40} />
    ),
    path: APP_PATH.GITHUB(),
    newTab: true
  },
  {
    title: (
      <Image
        src={'/icons/linkedin.svg'}
        alt="linkedin"
        width={40}
        height={40}
      />
    ),
    path: APP_PATH.LINKEDIN(),
    newTab: true
  }
]

export const TopNavigationMenu = ({ className }: TopNavigationMenuProps) => {
  const currentPath = usePathname()
  return (
    <ul className={cn('flex w-full md:w-fit justify-evenly gap-2', className)}>
      {TOP_NAVIGATION_LIST.map((items) => (
        <LinkComponent key={items.path} currentPath={currentPath} {...items} />
      ))}
      <li className="ml-4 flex items-center justify-center">
        <SearchModal>
          <Search
            size={24}
            role="button"
            className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
          />
        </SearchModal>
      </li>
    </ul>
  )
}

const LinkComponent = ({
  title,
  path,
  currentPath,
  newTab
}: {
  title: ReactNode
  path: string
  currentPath: string
  newTab?: boolean
}) => {
  return (
    <li className="text-center">
      <Link
        href={path}
        target={newTab ? '_blank' : '_self'}
        className={cn(
          'relative group hover:scale-105 active:scale-95 flex justify-center items-center h-[40px] w-fit py-2 px-2 rounded-xl hover:bg-navy-100/40 hover:text-navy-500/50 transition-all duration-300',
          currentPath === path && 'text-navy-700 bg-navy-200 '
        )}
      >
        {title}
      </Link>
    </li>
  )
}
