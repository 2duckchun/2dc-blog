'use client'

import { Search } from 'lucide-react'
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
    title: 'POST',
    path: APP_PATH.POST()
  },
  {
    title: 'GITHUB',
    path: APP_PATH.GITHUB(),
    newTab: true
  }
]

export const TopNavigationMenu = ({ className }: TopNavigationMenuProps) => {
  const currentPath = usePathname()
  return (
    <ul className={cn('flex min-w-[220px] justify-evenly gap-3', className)}>
      {TOP_NAVIGATION_LIST.map((items) => (
        <LinkComponent key={items.title} currentPath={currentPath} {...items} />
      ))}
      <li className="flex items-center justify-center">
        <SearchModal>
          <Search role="button" className="cursor-pointer" />
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
  title: string
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
          'relative group flex justify-center items-center h-[40px] w-fit py-2 px-4 rounded-xl hover:bg-navy-100 hover:text-navy-700 transition-all',
          currentPath === path && 'text-navy-700 bg-navy-200 '
        )}
      >
        {title}
      </Link>
    </li>
  )
}
