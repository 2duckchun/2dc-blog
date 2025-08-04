'use client'

import { createContext, useContext, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TAB_LIST } from '@/shared/constants/tab-list'
import { ContentTabValueType, TagsDetailPost } from '@/types/tags'

interface MarkdownListContextType {
  markdownList: [string, TagsDetailPost][]
  currentTab: ContentTabValueType
  handleTabChange: (tab: ContentTabValueType) => void
  tabList: typeof TAB_LIST
  currentWorkingDirectory: string
}

export const MarkdownListContext =
  createContext<MarkdownListContextType | null>(null)

export const MarkdownListContextProvider = ({
  markdownList,
  children
}: {
  markdownList: [string, TagsDetailPost][]
  children: React.ReactNode
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const currentTab = parsePathnameAndMapToTab(pathname)
  const [currentWorkingDirectory, setCurrentWorkingDirectory] =
    useState<string>('')

  const handleTabChange = (tab: ContentTabValueType) => {
    router.push(`/${tab}`)
  }

  return (
    <MarkdownListContext.Provider
      value={{
        tabList: TAB_LIST,
        markdownList,
        currentTab,
        handleTabChange,
        currentWorkingDirectory
      }}
    >
      {children}
    </MarkdownListContext.Provider>
  )
}

export const useMarkdownListContext = () => {
  const context = useContext(MarkdownListContext)
  if (!context) {
    throw new Error('MarkdownListContext가 생성되지 않았습니다.')
  }
  return context
}

const parsePathnameAndMapToTab = (pathname: string): ContentTabValueType => {
  const path = pathname.split('/')
  const parsedPath = path[path.length - 1]
  switch (parsedPath) {
    case 'problem-solving':
      return 'problem-solving'
    case 'note':
      return 'note'
    default:
      return 'post'
  }
}
