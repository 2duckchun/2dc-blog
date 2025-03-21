'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Input } from './input'

interface DebouncedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  value: string | number
  onDebounceHandler: (value: string | number) => void
  debounce?: number
}

export const DebouncedInput = ({
  className,
  value: initialValue,
  onDebounceHandler,
  debounce = 500,
  ...props
}: DebouncedInputProps): JSX.Element => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onDebounceHandler(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Input
      className={cn(className)}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
