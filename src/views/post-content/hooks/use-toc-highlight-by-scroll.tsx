import { useEffect, useState } from 'react'

interface TocItem {
  id: string
}

interface HeadingPosition {
  id: string
  top: number
}

export const useTocHighlightByScroll = (tocList: TocItem[]) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  useEffect(() => {
    if (tocList.length === 0) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const headings = getHeadingPositions(tocList)
          updateHighlightedId(headings, tocList, setHighlightedId)
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    // 초기 실행
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [tocList])

  return { highlightedId }
}

const getHeadingPositions = (tocList: TocItem[]): HeadingPosition[] => {
  return tocList
    .map(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return null
      const top = el.getBoundingClientRect().top
      return { id, top }
    })
    .filter((entry): entry is HeadingPosition => entry !== null)
}

const updateHighlightedId = (
  headings: HeadingPosition[],
  tocList: TocItem[],
  setHighlightedId: (id: string | null) => void,
  offset = 80 // 고정 헤더가 있으면 그 높이만큼 적당히 조정
) => {
  const viewportHeight = window.innerHeight
  const scrollY = window.pageYOffset ?? document.documentElement.scrollTop ?? 0
  const docHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight

  const isAtBottom = Math.abs(scrollY + viewportHeight - docHeight) < 5
  if (isAtBottom) {
    setHighlightedId(tocList.at(-1)?.id ?? null)
    return
  }

  // 1) 현재 스크롤 기준으로 "지나간" 헤딩들(top <= offset)
  const passed = headings.filter(({ top }) => top <= offset)

  if (passed.length > 0) {
    // 가장 최근에 지나간 헤딩 = 마지막
    setHighlightedId(passed[passed.length - 1].id)
    return
  }

  // 2) 아직 첫 헤딩 위라면 첫 번째
  setHighlightedId(tocList[0]?.id ?? null)
}
