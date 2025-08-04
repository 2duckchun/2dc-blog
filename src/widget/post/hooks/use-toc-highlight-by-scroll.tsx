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
  setHighlightedId: (id: string | null) => void
) => {
  const viewportHeight = window.innerHeight
  const scrollY = window.scrollY
  const documentHeight = document.body.scrollHeight

  const isAtBottom = Math.abs(scrollY + viewportHeight - documentHeight) < 5
  if (isAtBottom) {
    setHighlightedId(tocList.at(-1)?.id ?? null)
    return
  }
  const visibleHeadings = headings.filter(({ top }) => top >= 0)
  if (visibleHeadings.length > 0) {
    setHighlightedId(visibleHeadings[0].id)
  } else {
    setHighlightedId(tocList[0]?.id ?? null)
  }
}

// import { useEffect, useState } from 'react'

// interface TocItem {
//   id: string
// }

// export const useTocHighlightByScroll = (tocList: TocItem[]) => {
//   const [highlightedId, setHighlightedId] = useState<string | null>(null)

//   useEffect(() => {
//     if (tocList.length === 0) return
//     let ticking = false

//     const handleScroll = () => {
//       if (ticking) return
//       ticking = true
//       requestAnimationFrame(() => {
//         const viewportHeight = window.innerHeight
//         const scrollY = window.scrollY
//         const documentHeight = document.body.scrollHeight
//         const isAtBottom =
//           Math.abs(scrollY + viewportHeight - documentHeight) < 5

//         if (isAtBottom) {
//           // 맨 아래 도달 → 마지막 항목 하이라이트
//           setHighlightedId(tocList[tocList.length - 1]?.id ?? null)
//           ticking = false
//           return
//         }

//         // headings 위치 계산
//         const headings = tocList
//           .map(({ id }) => {
//             const el = document.getElementById(id)
//             if (!el) return null
//             const rect = el.getBoundingClientRect()
//             return { id, top: rect.top }
//           })
//           .filter(
//             (entry): entry is { id: string; top: number } => entry !== null
//           )
//         // top >= 0인 heading 중 가장 위에 있는 것 선택
//         const visibleHeadings = headings.filter(({ top }) => top >= 0)

//         if (visibleHeadings.length > 0) {
//           const target = visibleHeadings[0]
//           setHighlightedId(target.id)
//         } else {
//           // 스크롤이 맨 위일 때 → 첫 번째 heading 하이라이트
//           setHighlightedId(tocList[0]?.id ?? null)
//         }

//         ticking = false
//       })
//     }

//     window.addEventListener('scroll', handleScroll, { passive: true })
//     window.addEventListener('resize', handleScroll)
//     handleScroll()

//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//       window.removeEventListener('resize', handleScroll)
//     }
//   }, [tocList])

//   return { highlightedId }
// }
