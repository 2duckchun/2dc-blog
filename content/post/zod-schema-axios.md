---
title: 'zod를 활용한 axios 핸들러 설계하기'
description: '유효성 검사 라이브러리 Zod를 적절하게 사용하여 axios 응답 처리를 안전하게 해봅니다.'
thumbnail: '/images/zod.svg'
tags: ['frontend']
draft: false
created_date: 2025-03-15 22:54:13
---

# zod를 활용한 axios 핸들러 설계하기

오늘은 zod 스키마를 이용해 외부 API에서 받아온 데이터의 유효성을 검증하고, 검증된 데이터를 근거로 핸들러의 return 값을 적절히 가공하여, UI 에러 처리 과정 개선 등 개발 생산성을 향상시킬 수 있는 방법에 대해 포스팅합니다.

## 실습

### 0. 실습 환경

아래는 사용 프레임워크, 라이브러리입니다.

- Next.js v15(server actions)
- axios
- zod
- 교보재 API: https://jsonplaceholder.typicode.com

### 1. axios 인스턴스 세팅

실습에 활용할 axios 인스턴스를 세팅해줍니다. 이 글에서는 최소한으로만 세팅했습니다.

```ts
// axios/core/instance.ts

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default axiosInstance
```

필요한 것들이 있으시다면 재량껏 추가하시면 됩니다.

### 2. handle-actions 세팅

외부 API를 호출할 때 사용할 액션 핸들러를 세팅합니다.

특이한 점으로 파라미터에 `zod schema`가 있습니다.

`zod schema`는 외부 API에서 받아온 응답 객체의 데이터 타입을 신뢰할 수 있을지 검증하는 목적으로 사용될 것입니다.

```ts
import axiosInstance from './core/instance'
import { ZodSchema } from 'zod'
export const handleActions = async <T>({
  method,
  url,
  requestBody,
  schema
}: {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  requestBody?: any
  schema: ZodSchema<T>
}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: requestBody
    })
    const zodResult = schema.safeParse(response.data)
    if (!zodResult.success) {
      return {
        status: ACTION_STATUS.INVALID_DATA,
        message: '유효하지 않은 값입니다.'
      } as const
    }
    return {
      status: ACTION_STATUS.SUCCESS,
      message: '성공',
      data: zodResult.data
    } as const
  } catch (error) {
    return {
      status: ACTION_STATUS.SERVER_ERROR,
      message: '서버 오류가 발생했습니다.'
    } as const
  }
}

export const ACTION_STATUS = {
  SUCCESS: 'SUCCESS',
  SERVER_ERROR: 'SERVER_ERROR',
  INVALID_DATA: 'INVALID_DATA'
} as const
```

- 외부 API와 통신 후 수신한 응답 객체의 데이터에 대해 파라미터로 전달한 schema로 유효성 검증을 진행합니다.
- 유효성 검증에 실패했다면 UI에서 해당 에러에 대해 적절히 처리를 할 수 있도록 `INVALID_DATA` status를 정의하여 리턴합니다.
- 유효성 검증에 성공했다면 `SUCCESS` status와 함께 받아온 데이터를 리턴합니다.
- 서버 오류가 발생하여 catch문에 걸렸다면 `SERVER_ERROR` status를 리턴합니다.

### 3. server-action 정의하기

schema를 정의하고 handle-actions에 해당 schema를 전달할 함수를 만들어야 합니다.

저는 server-actions을 사용하고 있지만 **핵심은 API를 호출할 handler에 zod schema를 전달하는 것이므로,** 사용자 입맛에 따라 적절히 만드시면 됩니다.

```ts
'use server'

import { handleActions } from '@/shared/lib/axios/handle-actions'
import { z } from 'zod'

const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number()
})

export const getPosts = async () => {
  const response = await handleActions({
    method: 'get',
    url: '/posts',
    schema: z.array(postSchema)
  })

  return response
}
```

<Hint>
정의할 schema는 외부 API에서 실제로 전달받을 응답 객체 명세와 딱 맞아떨어져야만 합니다.

저는 해당 실습에서 jsonplaceholder를 사용했으므로, 해당 홈페이지를 참고하여 스키마를 정의했습니다.
</Hint>

### 4. UI 내 활용

이제 UI에서 해당 API를 호출해봅시다.

```tsx
import { getPosts } from '@/actions/placeholder'
import { ACTION_STATUS } from '@/shared/lib/axios/handle-actions'

export default async function PostsPage() {
  const { status, data, message } = await getPosts()

  if (status === ACTION_STATUS.SERVER_ERROR) {
    return <div>{message}</div>
  }

  if (status === ACTION_STATUS.INVALID_DATA) {
    return <div>{message}</div>
  }

  if (status === ACTION_STATUS.SUCCESS) {
    return (
      <div>
        {data.map((post) => (
          <div className="border-b border-gray-200 p-4" key={post.id}>
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p className="text-sm text-gray-500">{post.body}</p>
          </div>
        ))}
      </div>
    )
  }
}
```

이 활용 방법의 장점 중 하나는 자동완성 기능을 최대한으로 활용할 수 있다는 것입니다.

해당 핸들러 함수는 사전에 명시했던 데이터들(`status`, `message`, `data`)만 리턴해주기 때문에 UI에서 핸들러를 호출할 때 리턴값에 대해 이것저것 생각할 필요가 없습니다.
개발이 즐거워 지겠네요!

<img width="808" alt="image" src="https://github.com/user-attachments/assets/4e27a385-52e2-4d30-8d82-5db554e03d52" />

어떤 메세지를 표현할 수 있는지 자동 완성 기능에 다 묻어져 나오고,

<img width="734" alt="image" src="https://github.com/user-attachments/assets/e6ad8d28-8a08-49b5-9b83-b94ef9fc7c65" />

활용 가능한 STATUS들도 자동 완성 기능으로 볼 수 있습니다. 이건 정말 정말 편리합니다.

## 정리하며

**핵심은 API마다 schema를 정의해야한다**는 것이었습니다. API마다 schema를 작성하고, 매 응답마다 응답값에 대한 유효성 검증을 수행하면 아래와 같은 장점을 누릴 수 있습니다.

- schema 작업을 통해 백엔드 API의 명세를 한번 더 꼼꼼하게 익힐 수 있고,
- 정의된 schema에 맞지 않는 데이터가 응답으로 오게 될 경우, 유효하지 않은 데이터가 왔다는 UI에서 확인할 수 있으므로, 에러의 빠른 파악 및 대처가 가능해집니다.

여러모로 휴먼 에러도 줄이고, 개발 편의성도 크게 올려주는 활용법인 것 같습니다.
읽어주셔서 감사합니다.
