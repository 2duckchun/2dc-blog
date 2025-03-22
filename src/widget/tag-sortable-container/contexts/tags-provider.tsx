'use client'

import { createContext, useContext } from 'react'
import { TagTuple } from '@/types/tags'

const TagsContext = createContext<TagTuple[] | null>(null)

export const useTagsContext = () => {
  const context = useContext(TagsContext)
  if (!context) {
    throw new Error('Tags Context가 생성되지 않았습니다.')
  }
  return context
}

export const TagsContextProvider = ({
  taglist,
  children
}: {
  taglist: TagTuple[]
  children: React.ReactNode
}) => {
  return <TagsContext.Provider value={taglist}>{children}</TagsContext.Provider>
}
