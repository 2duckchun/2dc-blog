---
title: 'Next.js 15버전 주요 변경 사항 정리'
description: '새로운 버전. 제대로 팔로우업 해보겠습니다.'
thumbnail: '/images/nextjs.png'
tags: [frontend]
draft: false
created_date: 2024-11-22 23:58:15
---

# Next.js 15버전 주요 변경 사항 정리!

Next.js의 새로운 버전이 매년 꾸준히 출시되고 있습니다. 14버전에서는 13버전에서 `experimental` 단계였던 `Server Actions`이 프로덕션 수준의 안정적인 기능으로 도입된 것을 제외하고는 큰 변화가 없었죠.

하지만 이번 15버전에서는 Next.js의 기존 불편했던 점들이 대폭 개선되면서 개발 편의성과 자유도가 한층 높아졌습니다. 특히, 여러 불편했던 부분이 해결된 덕분에 개발 생산성이 크게 향상될 것으로 보입니다.

이번 포스팅에서는 Next.js 15버전의 주요 변경사항과 새로운 기능들을 정리해보려 합니다. 이렇게 정리를 해두면 신버전 사용시 막히는 부분 없이 더 수월하게 적응할 수 있을거라 생각합니다. 함께 살펴보시죠!

## 비동기 Request APIs (주요 변경 사항)

이전에는 동기적으로 동작하던 런타임 정보에 의존하는 `Dynamic API`들이 이제 비동기 방식으로 변경되었습니다.

- layout.js, page.js, route.js, default.js, opengraph-image, twitter-image, icon, apple-icon의 `params`
- page.js의 `searchParams`
- `cookies`
- `headers`
- `draftMode`

### params & searchParams 사용방법 변경

`params`와 `searchParams`의 사용 방식이 더욱 세분화되었습니다. 특히 `React`의 훅 중 하나인 `use`의 도입으로 서버 사이드와 클라이언트 사이드에서의 `params`를 더욱 명시적으로 구분지어 호출할 수 있게 되었습니다.

#### Asynchronous Layout

```ts
// Before
type Params = { slug: string }

export function generateMetadata({ params }: { params: Params }) {
  const { slug } = params
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = params
}

// After
type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = await params
}
```

과거에는 동기적으로만 접근할 수 있었던 `params`를 비동기적으로도 사용할 수 있게 되었습니다. 다만 그로인해 params는 Promise를 반환하게 되었네요.
실사용에서는 `Layout`을 `async` 함수로 변경하고, `params`에 `await`를 붙여 코드 흐름을 제어하는 정도 외에는 큰 차이는 없습니다.

#### Synchronous Layout

```tsx
// Before
type Params = { slug: string }

export default function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = params
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>

export default function Layout(props: {
  children: React.ReactNode
  params: Params
}) {
  const params = use(props.params)
  const slug = params.slug
}
```

`use` 훅의 도입으로 클라이언트 사이드에서 params를 동기적으로 받아올 수 있게 되었습니다. `React`의 기본 훅인 `use`는 `Promise`나 `Context`와 같은 리소스를 읽는 기능을 제공합니다.

이를 통해 본질적으로 `asnyc`가 될 수 없는 클라이언트 사이드 레이아웃에서도, 서버 사이드 레이아웃에서 `await`로 `params`를 처리하는 것과 유사한 방식으로 동작할 수 있습니다.

#### Asynchronous Page

```ts
// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export function generateMetadata({
  params,
  searchParams
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

export default async function Page({
  params,
  searchParams
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

// After
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}
```

비동기적 페이지도 비동기적 레이아웃과 비슷하게 동작하는 것 같습니다.

#### Synchronous Page

```ts
'use client'

// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export default function Page({
  params,
  searchParams
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}
```

동기적 페이지도 `use`를 사용해 `params`를 사용합니다. 동기적 레이아웃과 비슷하게 동작하는 것 같네요.

### cookies

```ts
import { cookies } from 'next/headers'

// Before
const cookieStore = cookies()
const token = cookieStore.get('token')

// After
const cookieStore = await cookies()
const token = cookieStore.get('token')
```

동기적으로 동작하던 Request API의 `cookies` 함수가 비동기 함수로 바뀌었습니다.
호출 시 await를 붙이는 것 외에는 별다른 기능 변경은 없는 듯 합니다.

### headers

```ts
import { headers } from 'next/headers'

// Before
const headersList = headers()
const userAgent = headersList.get('user-agent')

// After
const headersList = await headers()
const userAgent = headersList.get('user-agent')
```

`headers` 함수도 비동기 함수로 변경되었습니다.

사실 `cookies`나 `headers`가 서버 사이드에서 동작하는 것을 감안하면, 이는 매우 자연스러운 변화로 보여집니다. 서버 환경에서 비동기 작업이 일반적이라는 것을 고려했을 때, 이 패치는 당연한 개선이라고도 볼 수 있겠네요.

### draftMode

```ts
import { draftMode } from 'next/headers'

// Before
const { isEnabled } = draftMode()

// After
const { isEnabled } = await draftMode()
```

`draftMode` 함수도 비동기적으로 변경되었다고 합니다. 아직 사용해본 경험은 없지만, 이 함수는 정적 페이지를 빌드 타임 없이도 내용을 업데이트 할 수 있게 해주는 스위치 역할을 하는 것으로 보입니다. 나중에 필요할 때 제대로 공부해봐야 할 것 같습니다.

## 런타임 환경 (주요 변경 사항)

### fetch request

이제 더 이상 fetch의 디폴트값으로 캐싱이 발생하지 않습니다. 특정 fetch 요청을 캐싱으로 최적화하려면 `cache: 'force-cache'`를 추가하셔야 합니다.

```ts
export default async function RootLayout() {
  const a = await fetch('https://...') // Not Cached
  const b = await fetch('https://...', { cache: 'force-cache' }) // Cached

  // ...
}
```

페이지나 레이아웃의 fetch 요청을 캐싱하려면 상단에 `export const fetchCache = 'default-cache'`을 추가해주세요. 이렇게 하면 해당 트리 내 모든 fetch들은 자동으로 캐싱됩니다. 하지만 개별 fetch 요청에 cache 옵션이 명시되어 있다면 해당 fetch는 개별적으로 설정된 캐싱 정책을 따릅니다. 아래 코드를 참고해주세요.

```ts
// app/layout.ts
// root layout에 fetchCache가 명시되었으므로
// app의 모든 fetch는 별도의 cache 옵션이 주어지지 않는 한 캐싱됩니다.
export const fetchCache = 'default-cache'

export default async function RootLayout() {
  const a = await fetch('https://...') // Cached
  const b = await fetch('https://...', { cache: 'no-store' }) // Not cached

  // ...
}
```

이번 패치는 정말 기다려왔던 변화입니다. 👏👏👏 요즘 대부분의 모던 웹 페이지는 사용자들에게 최신 정보를 제공해주기위해 데이터를 자주 갱신해야 하는 상황이죠. 이런 환경에서 강제로 캐싱을 지원하는 것 보다는, 개발자가 의도적으로 특정 데이터만 캐싱할 수 있도록 하는 것이 훨씬 합리적이고 효율적이라는 생각이 듭니다. 이런 변화는 개발자들에게 더 큰 유연성과 선택권을 준다는 점에서 매우 긍정적으로 받아들여지네요!

## 클라이언트 사이드 라우터 캐시

페이지 간에 `<Link>`나 `useRouter`를 통해 이동할 때, 이제 페이지 세그먼트가 `클라이언트 사이드 페이지 라우터 캐시`에 재사용되지 않습니다. 다만 브라우저 `뒤로가기`나 `앞으로 가기` 또는 `공유 레이아웃`에서는 여전히 재사용됩니다.

페이지 세그먼트를 캐싱하려면 `staleTimes` 설정 옵션을 사용할 수 있습니다.

```ts
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180
    }
  }
}

module.exports = nextConfig
```

## 총평: GOAT

개인적으로 이번 버전은 **GOAT**라고 불러도 손색이 없다고 생각합니다. 특히 **캐싱 관련 업데이트**가 정말 마음에 드는데요. 이제는 강제 캐싱이 아닌, **개발자가 의도한대로 캐싱을 선택**할 수 있게 되었습니다. 이전 버전에서는 강제 캐싱으로 인해 답답했던 경험이 많았는데, 이번 업데이트로 마치 십년 묵은 체증이 내려가는 기분입니다.

`params` 관련 패치도 굉장히 만족스럽습니다. 서버 사이드(비동기적)와 클라이언트 사이드(동기적)에서 각각 params를 호출하는 방법을 명확히 구분해둔 점이 특히 좋았는데요. 이 덕분에 앞으로 페이지를 설계할 때 서버 사이드와 클라이언트 사이드 중 어떤 것을 선택할지 고민하며 더 세밀한 설계를 할 수 있을 것 같습니다.

이번 버전, 정말 최고입니다.
