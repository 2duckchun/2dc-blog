import { useEffect, useRef, useState } from 'react'
import { TocData } from '@/types/post'

export const useGetTocAllNodeList = (selector: string) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [tocList, setTocList] = useState<TocData[]>([])
  useEffect(() => {
    if (contentRef.current) {
      const nodelist = contentRef.current.querySelectorAll(selector)
      const rawTocData: TocData[] = []
      nodelist.forEach((list) => {
        rawTocData.push({
          title: list.textContent ?? '',
          id: list.id,
          nodeName: list.nodeName as Extract<TocData, 'nodeName'>
        })
      })
      setTocList([...rawTocData])
    }
  }, [selector])

  return {
    contentRef,
    tocList
  }
}
