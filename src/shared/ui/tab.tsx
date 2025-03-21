import { HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface TabProps extends HTMLAttributes<HTMLDivElement> {
  tabList: {
    label: string
    value: string
  }[]
  currentTab: string
  setTab: (tab: string) => void
}

export const Tab = ({
  className,
  currentTab,
  tabList,
  setTab,
  ...props
}: TabProps) => {
  return (
    <div className={cn('flex items-center h-fit w-full', className)} {...props}>
      {tabList.map((item) => (
        <div
          key={item.value}
          className={cn(
            'cursor-pointer text-center flex items-center justify-center min-h-[50px] flex-1 border-b-2 border-gray-200',
            currentTab === item.value && 'border-navy-600'
          )}
          onClick={() => setTab(item.value)}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}
