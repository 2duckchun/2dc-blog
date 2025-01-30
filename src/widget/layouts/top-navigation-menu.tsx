'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_PATH } from '@/constants/app-path'
import { cn } from '@/lib/utils'
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
    <ul className={cn('flex min-w-[350px] justify-evenly gap-1', className)}>
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
        className={cn('relative group')}
      >
        {title}
        <div
          className={cn(
            'absolute left-[50%] bottom-0 -translate-x-[50%] h-[2px] z-50',
            currentPath === path
              ? 'bg-black w-[95%] '
              : 'transition-all w-0 group-hover:w-[95%] bg-black'
          )}
        ></div>
      </Link>
    </li>
  )
}
