'use client'

import { cn } from '@/shared/lib/utils'
import { Tab } from '@/shared/ui/tab'
import { ContentTabValueType } from '@/domain/post/schema/tags'
import { useMarkdownListContext } from '../../contexts/use-markdown-list-context'

interface HomeTabProps {
  className?: string
}

export const PostTab = ({ className }: HomeTabProps) => {
  const { currentTab, handleTabChange, tabList } = useMarkdownListContext()

  return (
    <div className={cn(className)}>
      <Tab
        tabList={tabList}
        currentTab={currentTab}
        setTab={(tab: string) => handleTabChange(tab as ContentTabValueType)}
      />
    </div>
  )
}
