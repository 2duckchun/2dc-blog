'use client'

import { useEffect, useRef } from 'react'

export const useDragElement = () => {
  const draggableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let pos1 = 0
    let pos2 = 0
    let pos3 = 0
    let pos4 = 0

    const closeDragElement = () => {
      document.onmouseup = null
      document.onmousemove = null
    }

    const draggingElement = (e: MouseEvent) => {
      e.preventDefault()
      pos1 = pos3 - e.clientX
      pos2 = pos4 - e.clientY
      pos3 = e.clientX
      pos4 = e.clientY
      if (draggableRef.current) {
        const topValue = draggableRef.current?.offsetTop - pos2 + 'px'
        const leftValue = draggableRef.current?.offsetLeft - pos1 + 'px'
        draggableRef.current.style.top = topValue
        draggableRef.current.style.left = leftValue
      }
    }

    const dragMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      pos3 = e.clientX
      pos4 = e.clientY
      document.onmouseup = closeDragElement
      document.onmousemove = draggingElement
    }

    if (draggableRef.current) {
      draggableRef.current.addEventListener('mousedown', dragMouseDown)
    }
  }, [])

  return draggableRef
}
