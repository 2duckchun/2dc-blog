'use client'

import { Hash } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export const H1HashButton = ({
  id,
  children
}: {
  id: string
  children: React.ReactNode
}) => {
  const handleScroll = () => {
    const element = document.getElementById(id)
    if (!element) {
      console.warn(`⚠️ Element with id '${id}' not found.`)
      return
    }

    const yOffset = -80
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset

    window.scrollTo({ top: y, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="group relative">
      <Button
        variant="link"
        className="absolute -left-7 top-[5px] hidden -translate-x-3 px-3 text-center text-xl group-hover:block"
        onClick={handleScroll}
      >
        <Hash className="size-5" strokeWidth={3} />
      </Button>
      <h1 id={id}>{children}</h1>
    </div>
  )
}
