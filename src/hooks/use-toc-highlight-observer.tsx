import { RefObject, useEffect, useState } from 'react'

const options = {
  root: null,
  threshold: 0
}

export const useTocHighlightObserver = (
  contentRef: RefObject<HTMLDivElement>
) => {
  const [highlightText, setHighlightText] = useState<string>('')
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setHighlightText(entry.target.textContent ?? '')
        }
      })
    }, options)
    if (contentRef.current) {
      const nodelist = contentRef.current.querySelectorAll('h1, h2, h3')
      nodelist.forEach((toc) => observer.observe(toc))
    }
    return () => observer.disconnect()
  }, [contentRef])

  return { highlightText }
}
