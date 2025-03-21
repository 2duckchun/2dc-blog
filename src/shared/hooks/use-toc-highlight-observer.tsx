import { RefObject, useEffect, useRef, useState } from 'react'

const options = {
  root: null,
  threshold: 1.0
}

export const useTocHighlightObserver = (
  contentRef: RefObject<HTMLDivElement>
) => {
  const [trigger, setTrigger] = useState<string>('')
  const higtlightTextObject = useRef<Record<string, any>>({})

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTrigger(entry.target.textContent ?? '')
        }
        if (entry.isIntersecting) {
          higtlightTextObject.current[entry.target.textContent as string] = true
        } else if (!entry.isIntersecting) {
          higtlightTextObject.current[entry.target.textContent as string] =
            false
        }
      })
    }, options)
    if (contentRef.current) {
      const nodelist = contentRef.current.querySelectorAll('h1, h2, h3')
      nodelist.forEach((toc) => observer.observe(toc))
    }
    return () => observer.disconnect()
  }, [contentRef])

  return { trigger, higtlightTextObject }
}
