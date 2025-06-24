---
title: '[React] intersectionObserver을 이용한 useInView 구현'
description: 'IntersectionObserver를 활용한 자동 감지 및 RefCallback 활용'
thumbnail: '/images/react.png'
tags: ['frontend']
draft: false
created_date: 2025-06-24 22:35:56
---

# intersectionObserver을 이용한 useInView 구현

스크롤바가 하단을 긁고 있는지 체크하기 위한 코드를 짜야했습니다. 통상적으로 스크롤을 감지한다고 하면 스크롤 이벤트 활용을 생각할 수 있습니다. 어려울게 없는 구현이다보니 깊히 생각하지 않고 아래와 같은 코드를 짰습니다.

```ts
'use client'

import { useEffect, useRef } from 'react'

export default function ScrollPage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = el
      const buffer = 4
      const reachedBottom = scrollTop + clientHeight >= scrollHeight - buffer
      console.log(reachedBottom)
    }
    el.addEventListener('scroll', handleScroll)

    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      <div ref={ref} className="h-[600px] overflow-y-auto bg-teal-500">
        <div className="h-[500px] bg-red-500"></div>
        <div className="h-[500px] bg-orange-500"></div>
        <div className="h-[500px] bg-yellow-500"></div>
        <div className="h-[500px] bg-green-500"></div>
      </div>
    </div>
  )
}
```

element의 높이 관련 속성을 이용해 스크롤의 위치가 어디있는지를 계산하는 직관적이고 원시적인 방식으로 구현한 코드 예시입니다.

<img width="734" alt="image" src="https://github.com/user-attachments/assets/c9ada8cf-3de3-4d05-b21e-7369e256a9a8" />

- **scrollTop** : 현재 스크롤 위치를 알려줍니다. 상단을 기준으로 하므로, 스크롤이 맨 위에 있다면 0이 됩니다.
- **clientHeight** : client라는 말에 주목할 필요가 있습니다. 뷰포트에 보여지는 화면의 높이가 몇인지 알 수 있습니다.
- **scrollHeight** : 스크롤 가능한 element의 총 높이입니다.

scrollHeight가 2000이고 clientHeight가 600이라는 가정하에, 스크롤을 다 내리면 scrollTop이 1400이 됩니다.
최종적으로 스크롤을 다 내리면 `clientHeight + scrollTop`와 `scrollHeight`가 같아지는데요. 너무 딱 맞게 하면 여유가 없으니 약간의 완충값을 사용하여 `clientHeight + scrollTop >= scrollHeight - buffer(완충값)`으로 스크롤이 element의 맨 밑에 닿았는지 감지합니다.

여하튼 위와 같은 코드를 짜고 팀장님께 리뷰를 받았습니다. **스크롤 이벤트를 쓰게 되면 코드가 너무 절차지향적이고, DOM에 접근하여 계산하는게 많으니 저런 코드가 쌓이면 쌓일수록 유지보수에 좋지 않을 것이다**라는 피드백을 얻을 수 있었습니다. 그리고 대안으로 `motion` 라이브러리의 `useInView` 활용을 소개해 주셨습니다.

```tsx
import { useInView } from 'motion/react'

// ...중략

const isInView = useInView(bottomRef, {
  once: false,
  amount: 0.5
})

<div ref={bottomRef} className="h-[50px]">감지할 바닥</div>
```

햐. 깔끔합니다. 선언적인 방식이 너무나도 맘에 들었습니다. 역시 올바른 라이브러리의 적절한 활용은 코드 품질과 생산성을 크게 높혀주는 것 같습니다.

이 코드에 왠지 모르게 꽂혔고(?), 이처럼 깔끔한 코드는 앞으로 자주 써먹어야 할 방식같으므로 내부 구현을 흉내내보고자 아래와 같이 useInView을 커스텀 해보았습니다.

## 커스텀 useInView

useInView의 인자값을 보고 아 얘는 내부적으로 `intersectionObserver`를 사용하겠구나 라는 감이 왔습니다.

`intersectionObserver`는 자주 사용하는 코드가 아니다보니 오랜만에 활용을 좀 해볼겸, 아래와 같이 코드를 만들어본 후 테스팅 해보았습니다. (막히는 부분은 AI의 도움을 약간 받았습니다.)

### useInView

```ts
'use client'

import { RefCallback, useEffect, useRef, useState, useCallback } from 'react'

type UseInViewOptions = {
  root?: Element | null
  rootMargin?: string
  threshold?: number
} // 기본 intersectionObserver 옵션들입니다.

export const useInView = (
  options: UseInViewOptions
): {
  ref: RefCallback<Element>
  inView: boolean
} => {
  const [inView, setInView] = useState(false)
  const observer = useRef<IntersectionObserver>(null)
  const elementRef = useRef<Element | null>(null)

  // RefCallback은 DOM 요소가 마운트/언마운트될 때마다 실행되는 함수형 ref입니다.
  // 아래서 더 보충 설명합니다.
  const setRef = useCallback<RefCallback<Element>>((node) => {
    if (elementRef.current) {
      observer.current?.unobserve(elementRef.current)
    }
    // 이전에 감시 중이던 element가 있다면 unobserve로 감시를 해제합니다.
    // 이전 DOM을 감시한 채로 새 DOM도 감시하게 되면 중복 감시나 메모리 누수 발생 가능성이 있습니다.

    if (node) {
      elementRef.current = node
      observer.current?.observe(node)
    }
    // 새롭게 들어온 DOM(node)을 elementRef.current에 저장합니다.
  }, [])

  useEffect(() => {
    // 기본적인 IntersectionObserver 활용 방식입니다.
    // IntersectionObserver 인스턴스를 생성하고,
    // observer 콜백에서 요소의 뷰포트 진입 여부(isIntersecting)를 판단해 상태값(inView)을 업데이트합니다.
    observer.current = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? '0px',
        threshold: options.threshold ?? 0
      }
    )

    if (elementRef.current) {
      observer.current.observe(elementRef.current)
    }
    // 초기 마운트 시 elementRef.current가 존재하면 observer 등록을 즉시 수행합니다.

    return () => observer.current?.disconnect()
    // 언마운트 시 감시를 종료합니다.
  }, [options.root, options.rootMargin, options.threshold])

  return { ref: setRef, inView }
}
```

### 사용 예시

```tsx
'use client'

import { useEffect } from 'react'
import { useInView } from './hook/use-in-view'

export default function ScrollObserverPage() {
  const { ref, inView } = useInView({
    threshold: 0.5
  })

  useEffect(() => {
    if (inView) {
      console.log('바닥 보인다')
    }
  }, [inView])

  return (
    <div>
      <div className="h-[600px] overflow-y-auto bg-teal-500">
        <div className="h-[500px] bg-red-500"></div>
        <div className="h-[500px] bg-orange-500"></div>
        <div className="h-[500px] bg-yellow-500"></div>
        <div className="h-[500px] bg-green-500"></div>
        <div ref={ref} className="h-[50px]">
          나는바닥이야
        </div>
      </div>
    </div>
  )
}
```

결과적으로, 원하는대로 잘 동작합니다.

## RefCallback

이번 구현에서 GPT가 `RefCallback`의 활용에 대해 추천을 해주었습니다. 덕분에 존재 이유만 알고 있었던 `RefCallback`에 대해 좀 더 자세히 공부할 수 있게 되었습니다.

```ts
type RefCallback<T> = (instance: T | null) => void
```

React에서 ref는 두 가지 방식으로 전달할 수 있습니다.

- **객체형 ref (Object Ref)** : useRef()로 만든 객체
- **함수형 ref (Callback Ref)** : RefCallback 타입의 함수

`RefCallback`은 ref 속성에 전달할 수 있는 함수 타입으로, ref가 전달된 element가 마운트/언마운트 될 때 instance에 각각 DOM이나 null이 할당됩니다.

풀이하자면 아래 구조와 같습니다.

```ts
const ref: RefCallback<HTMLDivElement> = (node) => {
  if (node) {
    // 마운트 됐을 때 실행
  } else {
    // 언마운트 됐을 때 실행
  }
}
```

### 왜 사용했는가?

`useRef`만으로는 DOM element의 마운트/언마운트 여부를 직접 알 수 없습니다. 하지만 `RefCallback`은 마운트될 때 DOM 노드를 인자로 받고, 언마운트될 때 null을 전달하므로 시점을 명확하게 구분할 수 있습니다.

```ts
const callbackRef = (node: HTMLDivElement | null) => {
  if (node) {
    console.log('Mounted', node)
  } else {
    console.log('Unmounted')
  }
}
```

따라서 기존 요소의 관찰 해제와 새로운 요소의 관찰 등록을 자동으로 처리하기에는 `RefCallback`이 유리합니다.

```ts
const prevRef = useRef<Element | null>(null)
const observer = useRef<IntersectionObserver>()

const setRef = useCallback((node: Element | null) => {
  if (prevRef.current) {
    observer.current?.unobserve(prevRef.current)
  }

  if (node) {
    observer.current?.observe(node)
    prevRef.current = node
  }
}, [])
```

### 주의할 점

`useCallback`과 함께 사용하지 않으면 매 렌더마다 다른 함수를 만들어서 React가 ref를 계속 해제하고 재설정하는 일이 생길 수 있습니다. 반드시 useCallback으로 메모이제이션 해주는 것이 중요합니다.

## 회고

선언적인 코드 뒤에는 복잡한 코드들이 있습니다. 내가 쓰는 라이브러리들 내부에 어떤 복잡한 원리가 숨어있는지 공부해보는 것은 굉장히 즐거운 것 같습니다.

팀장님께서 추천해주신 라이브러리 하나로 인해 생각보다 괜찮은 지식과 깨달음(?)을 얻어갈 수 있는 시간이었습니다.
