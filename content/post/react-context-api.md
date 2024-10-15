---
title: 'Context API 쉽게 이해하고 사용하기 with 타입스크립트'
description: '컨텍스트는 어렵지 않습니다. 이해만 잘 한다면 우리의 좋은 친구가 되어줍니다.'
thumbnail: '/images/react.png'
tags: [frontend]
draft: false
created_date: 2024-10-10 23:14:19
---

# Context API 쉽게 이해하고 사용하기 with 타입스크립트

리액트를 처음 접하실 때 가장 첫번째로 맞닥드리는 통곡의 벽은 아마 `Context API`가 아닐까 합니다. 사실 컨텍스트 자체에 대한 개념을 이해하지 못한 상태에서 바로 실무에 적용하기에는 난잡하고 복잡한 부분이 많지요. 그래도 사용하다보면 어느 정도 두려움이 사라지고 재미있고 즐겁게 사용할 수 있게 됩니다.

이 글에서는 `Context API`에 대한 막연한 어려움을 해소해보고, 타입스크립트를 이용해 간단하게 Context API를 활용할 수 있는 구조를 짜봄으로써 여러분들께 도움이 되는 시간을 가져보자 합니다.

## Context란?

Context(이하 컨텍스트)는 주로 언어학에서 쓰이는 말입니다. 언어는 텍스트와 컨텍스트의 집합체다라는 말이 있지요. 텍스트는 단순히 글자들만을 나타냅니다. 그러한 텍스트들이 어떤 상황이나 상태를 표현하는 문맥과 합쳐저 진정한 언어가 됩니다. 즉 컨텍스트의 본질은 **상황이나 환경**이라고 할 수 있겠습니다.

컨텍스트가 가지는 본질은 프로그래밍에도 동일합니다. 다만 세부사항이 약간은 다릅니다. 컴퓨터과학에서 컨텍스트는 **수행되는 작업이나 프로세스가 실행되는 환경** 이라고 해석할 수 있겠습니다. 이번에 우리가 다룰 Context API는 함수나 메서드, 변수를 참조할 수 있는 하나의 공간이자 환경 또는 문맥을 의미한다고 생각할 수 있겠네요!

실제로 리액트의 Context API는 위의 정의와 동일한 역할을 수행합니다. **컨텍스트 API는 컴포넌트 간 깊은 Props Drilling이 생기는 것을 막기 위해 존재하는 기능이고, 그 기능은 컨텍스트라는 방법을 통해 구현되었습니다.**

컨텍스트 API를 사용하면 개발자가 변수를 담을 문맥을 생성하여 특정 컴포넌트에 전역적으로 사용할 수 있게 합니다. 이를 통해 상태 관리가 더 간편해지고, 컴포넌트 설계도 효율적으로 이뤄지지요.

## React Context API

이제 React의 Context API에 대해 조금 더 알아가는 시간을 가져보도록 할까요? 특정 기술에서 제공하는 기능을 공부하기 위해서는 공식문서만한 소스도 없습니다. 저는 아래 링크를 한번 훑어보시는 것을 추천드립니다. **(사실 아래 링크에 Context API에 대한 모든 것이 들어있습니다.)**

https://react.dev/learn/passing-data-deeply-with-context

<img width="528" alt="image" src="https://github.com/user-attachments/assets/f365eead-5ce3-4e57-92f8-0b7cfcd9d247" />

일반적으로, 부모 컴포넌트에서 자식 컴포넌트로 정보를 넘길때는 props를 이용합니다. 굉장히 편리하고 직관적인 방법이지만 컴포넌트의 깊이(Depth)가 증가할수록 props 관리가 매우 힘들어진다는 치명적인 단점이 있습니다. 위 사진처럼 컴포넌트가 줄줄이 고구마처럼 밑으로 뻗어있으면 유지보수가 험난해질 것은 너무나도 자명한 사실입니다. 이런 순간이 닥쳐올 것을 막기 위해서는 컨텍스트 API를 잘 활용해야만 합니다. **컨텍스트를 이용하면 컨텍스트 제공자(Context Provider)로 감싸진 하위 트리에 속하는 컴포넌트들에 대해 컨텍스트의 정보를 가져다 사용하게 함으로써 props drilling을 효과적으로 없애버릴 수 있습니다. 아래 그림처럼요.**

<img width="468" alt="image" src="https://github.com/user-attachments/assets/7a4d39d9-7366-498a-9686-c7bbaa5c36ea" />

## 동작원리 추상적으로 그려보기

Context API가 동작하는 원리를 그려보면 아마 아래와 같지 않을까요?

<img width="672" alt="image" src="https://github.com/user-attachments/assets/a81a9d9c-486e-4850-908d-0af7819ab7ad" />

0. 컨텍스트를 사용하려면 컨텍스트를 만들어야합니다. 리액트에서 제공하는 `createContext` 함수를 통해 컨텍스트를 생성할 수 있지요.
1. 0번 단계에서 만들어진 컨텍스트를 사용하려면 `provider`를 통해 컨텍스트에 추가할 값을 전달해야 합니다.
2. 1번 단계가 완료되면 `provider`에 감싸져있는 컴포넌트 트리들은 `useContext`를 호출하여 자신을 감싼 컨텍스트를 사용할 수 있게 됩니다.

그림으로 보는게 글로 보는 것 보단 더 이해가 잘 가지 않나요?

## Context API 사용 with 타입스크립트

그럼 마지막으로 컨텍스트를 사용하는 간단한 템플릿 소스코드를 공유하고 물러나도록 하겠습니다. 아래 코드는 제가 Context API를 사용할 때 주로 사용하는 구조입니다.

```ts
'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

// 1. 컨텍스트에 제공할 데이터를 만듭니다. 저는 보통 훅으로 만들어 코드를 분리합니다
// :: 이 과정에서 정말 본인이 컨텍스트를 필요로 하는지 고민해봅니다.
const useCtxData = () => {
  const [string, setString] = useState<string>('테스트 문구입니다!')
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 그 외 로직...

  return {
    string,
    isMounted
    // 그 외 컨텍스트를 통해 공유할 값들
  }
}

// 2. 컨텍스트를 만듭니다.
// :: ReturnType은 제네릭 유틸리티 타입입니다.
// :: typeof는 변수의 타입을 반환합니다.
// :: 두 개를 합쳐 함수의 반환값을 제네릭으로 만들어 타입 유동성을 살렸습니다.
const Ctx = createContext<ReturnType<typeof useCtxData> | null>(null)

// 3. 컨텍스트를 제공할 프로바이더를 아래와 같은 형식으로 만듧니다.
export const CtxProvider = ({ children }: { children: ReactNode }) => {
  // 3-1. 앞서 만들었던 컨텍스트에 사용할 데이터 훅을 불러와 Provider의 value에 그대로 제공합니다.
  const data = useCtxData()
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>
}

// 4. 컨텍스트를 사용할 컴포넌트에 쓰일 훅도 하나 만들어 줍시다.
// :: Provider로 컴포넌트를 감싸지 않은 상태에서 호출하면 에러를 내게끔 합니다.
// :: 아래 오류 메세지를 통해 어떤 컨텍스트를 사용하려다 에러가 난지 알 수 있게 되었습니다.
export const useCtxContext = () => {
  const context = useContext(Ctx)
  if (!context) throw new Error('Ctx 컨텍스트가 생성되지 않았습니다!')
  return context
}
```

위 재료들만 있으면 Context API를 자유자재로 활용할 수 있습니다. 간단한 예시를 들어볼까요?

```tsx
// CtxComponent.tsx
'use client'

import { useCtxContext } from '../../../content/post/context'

export const CtxComponent = () => {
  const { string } = useCtxContext()
  return <div>{string}</div>
}
```

위는 컨텍스트를 직접 활용할 컴포넌트입니다. 컨텍스트를 활용할 것이니만큼 useCtxContext를 호출해서 필요한 데이터를 끌어다오고 있습니다. **앞선 작업으로 인해 자동으로 타입 추론이 되기 때문에 사용하기가 한결 수월합니다.**

```tsx
import { CtxProvider } from '../../../content/post/context'
import { CtxComponent } from './ctx-component'

export const CtxContainer = () => {
  return (
    <CtxProvider>
      <CtxComponent />
    </CtxProvider>
  )
}
```

컨텍스트를 사용하는 컴포넌트들에게 원하는 데이터를 제공할 수 있도록 위처럼 Provider를 덧씌워줍니다. 이제 모든 과정이 끝났습니다.

<img width="374" alt="image" src="https://github.com/user-attachments/assets/c7a5c6c6-808d-437a-a80e-08a25ae23eed" />

정상적으로 동작하네요! 그럼 이만 글을 줄이겠습니다. 긴 글 읽어주셔서 감사합니다!
