import { createContext, useContext, useEffect, useState } from 'react'
import { getMarkdownListWithTagPerContent } from '@/server-actions/contents/get-content-markdown'
import { getCurrentWorkingDirectory } from '@/server-actions/contents/get-current-working-directory'
import { TAB_LIST } from '@/shared/constants/tab-list'
import { ContentTabValueType, TagsDetailPost } from '@/types/tags'

interface MarkdownListContextType {
  markdownList: [string, TagsDetailPost][]
  currentTab: ContentTabValueType
  handleTabChange: (tab: ContentTabValueType) => void
  isLoading: boolean
  tabList: typeof TAB_LIST
  currentWorkingDirectory: string
}

export const MarkdownListContext =
  createContext<MarkdownListContextType | null>(null)

export const MarkdownListContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [markdownList, setMarkdownList] = useState<[string, TagsDetailPost][]>(
    []
  )
  const [currentTab, setCurrentTab] = useState<ContentTabValueType>('post')
  const [isLoading, setIsLoading] = useState(false)
  const [currentWorkingDirectory, setCurrentWorkingDirectory] =
    useState<string>('')

  const handleTabChange = (tab: ContentTabValueType) => {
    // 히스토리가 이상해지는 이슈가 있음. 구조를 아예 바꿔야 할듯함
    window.history.replaceState(null, '', window.location.pathname)
    setCurrentTab(tab)
  }

  useEffect(() => {
    const fetchCWD = async () => {
      const cwd = await getCurrentWorkingDirectory()
      setCurrentWorkingDirectory(cwd)
      console.log('Current working directory:', cwd)
    }
    fetchCWD()
  }, [])

  useEffect(() => {
    const fetchMarkdownList = async () => {
      console.log('currentTab', currentTab)
      console.log('currentWorkingDirectory', currentWorkingDirectory)
      setIsLoading(true)
      const markdownList = await getMarkdownListWithTagPerContent(currentTab)
      setMarkdownList(markdownList)
      console.log('markdownList', markdownList)
      setIsLoading(false)
    }
    fetchMarkdownList()
  }, [currentTab, currentWorkingDirectory])

  return (
    <MarkdownListContext.Provider
      value={{
        tabList: TAB_LIST,
        markdownList,
        currentTab,
        handleTabChange,
        isLoading,
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
