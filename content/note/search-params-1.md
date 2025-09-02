---
title: '리액트에서 searchParams 사용시 주의사항'
description: 'searchParams 잘 못 쓰면 이상하게 에러가 납니다.'
thumbnail: ''
tags: ['React', 'Frontend']
draft: false
created_date: 2025-08-26 17:42:01
---

# 리액트에서 searchParams 사용시 주의사항

## 되도록 useEffect에서 쓰지 말 것

자동으로 코드를 관리하겠답시고 useEffect에 searchParams를 관리하는 로직을 넣는다면 알 수 없는 시점에서 웹이 이상하게 동작하는 현상이 발생할 것이다. 이를 막기 위해선 여러가지 방어코드를 넣어주어야할텐데, 그렇게 하면 버그가 너무나도 쉽게 생기게 된다.

어지간하면 searchParams는 명시적으로 사용할 수 있도록 구현하자.

### 아래처럼 사용하지 말자

```tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function BadExample() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // ❌ searchParams가 바뀔 때마다 router.replace 호출
    //    → 동일 URL이어도 계속 replace → 무한 루프/깜빡임 가능
    const params = new URLSearchParams(searchParams.toString())
    params.set('foo', 'bar')
    router.replace(`?${params.toString()}`)
  }, [searchParams, router])

  return <div>Bad Example</div>
}
```

### 명시적으로 사용하자

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GoodExample() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleClick = () => {
    // ✅ 명시적 이벤트 시점에만 URL 변경
    const params = new URLSearchParams(searchParams.toString())
    params.set('foo', 'bar')
    router.replace(`?${params.toString()}`)
  }

  return (
    <div>
      <p>Good Example</p>
      <button onClick={handleClick}>set foo=bar</button>
    </div>
  )
}
```

명시적으로 사용하자!
