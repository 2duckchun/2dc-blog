import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Tab } from '@/shared/ui/tab'

interface HomeTabProps {
  className?: string
}

export const HomeTab = ({ className }: HomeTabProps) => {
  const [currentTab, setCurrentTab] = useState('dev')
  const tabList = [
    { label: 'DEV', value: 'dev' },
    { label: 'ESSAY(공사중)', value: 'essay' },
    { label: 'PS(공사중)', value: 'ps' }
  ]
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
  }
  return (
    <div className={cn(className)}>
      <Tab tabList={tabList} currentTab={currentTab} setTab={handleTabChange} />
    </div>
  )
}
