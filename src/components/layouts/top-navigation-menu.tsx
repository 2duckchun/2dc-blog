'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_PATH } from '@/constants/app-path'
import { cn } from '@/lib/utils'

interface TopNavigationMenuProps {
  className?: string
}

const TOP_NAVIGATION_LIST = [
  {
    title: 'POST',
    path: APP_PATH.POST()
  },
  {
    title: 'SNIPPETS',
    path: APP_PATH.SNIPPETS()
  },
  {
    title: 'TAGS',
    path: APP_PATH.TAGS()
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
    <ul
      className={cn(
        'flex min-w-[300px] justify-evenly gap-1 group:',
        className
      )}
    >
      {TOP_NAVIGATION_LIST.map((items) => (
        <LinkComponent key={items.title} currentPath={currentPath} {...items} />
      ))}
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
    <Link
      href={path}
      target={newTab ? '_blank' : '_self'}
      className={cn(
        currentPath === path
          ? 'border-b-2 border-black'
          : 'before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-black before:transition-all',
        "relative before:content-[''] hover:before:w-full"
      )}
    >
      <li className="text-center">{title}</li>
    </Link>
  )
}
