'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type UpdateTagObject = {
  [key: string]: string
}

export const useQueryStringController = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const setQuertString = (updateTag: UpdateTagObject) => {
    const currentURLSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    )
    const newQueryStringList = Object.entries(updateTag)
    newQueryStringList.forEach((pair) => {
      currentURLSearchParams.set(pair[0], pair[1])
    })
    const current = currentURLSearchParams.toString()
    const query = current ? `?${current}` : ''
    router.push(`${pathname}${query}`)
  }

  return {
    setQuertString
  }
}
