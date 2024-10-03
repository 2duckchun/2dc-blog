'use client'

import { FunctionComponent, HTMLAttributes, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface UtterancesCommentsProps extends HTMLAttributes<HTMLDivElement> {}

const COMMENT_ID = 'comment_id'

export const UtterancesComments: FunctionComponent<UtterancesCommentsProps> = ({
  className,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const commentContainer = ref.current

    // 엘리먼트가 DOM에 완전히 렌더링 되었는지를 보장하기 위해 requestAnimationFrame을 사용함
    requestAnimationFrame(() => {
      const hasUtteranceScript = !!commentContainer?.querySelector(
        'script[src="https://utteranc.es/client.js"]'
      )

      // 컴포넌트 중첩 방지를 위해 체크함
      if (hasUtteranceScript) return

      if (commentContainer) {
        const script = document.createElement('script')
        script.src = 'https://utteranc.es/client.js'
        script.async = true
        script.setAttribute('repo', '2duckchun/2dc-blog')
        script.setAttribute('issue-term', 'pathname')
        script.setAttribute('theme', 'github-light')
        script.setAttribute('crossorigin', 'anonymous')
        commentContainer.appendChild(script)
      }
    })

    // 언마운트 시 commentContainer 내용 클린업
    return () => {
      if (commentContainer) {
        commentContainer.innerHTML = ''
      }
    }
  }, [])

  return (
    <section>
      <div
        className={cn('w-full', className)}
        id={COMMENT_ID}
        ref={ref}
        {...props}
      />
    </section>
  )
}
