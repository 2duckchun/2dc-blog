---
title: '[next.js] 쿼리스트링, URLSearchParams 학습 및 커스텀 훅 제작'
description: '이 포스트에서는 쿼리스트링과 URLSearchParams에 대해 학습해본 후, 공부한 내용을 바탕으로 URLSearchParams를 쉽게 다루기 위한 커스텀 훅을 제작해봅니다.'
thumbnail: '/images/nextjs.png'
tags: [frontend]
draft: false
created_date: 2024-10-05 23:45:46
---

# 쿼리스트링, URLSearchParams 학습 및 커스텀 훅 제작

특정 리소스를 `GET`으로 요청할 때, 소팅에 필요한 값을 함께 보내야하는 경우가 있습니다. 예시로 검색 엔진에서 고양이를 검색했을 때를 들 수 있겠습니다. 데이터를 요청하는 것이므로 GET 메서드를 써야하는 것은 자명한데, REST API는 GET 메서드에 BODY를 추가 하면 안된다고 합니다. 이러한 경우 <i>(보내야할 데이터가 민감하지 않은 정보라면)</i> 보통은 쿼리스트링을 사용해 문제를 해결합니다.

```
# 쿼리스트링 사용의 가장 일반적인 예시
https:www//검색엔진.com?keyword=고양이
```

이 뿐만이 아닙니다. 쿼리스트링은 자료를 보내는 것 뿐만 아니라 자료를 저장하는 DB의 역할도 수행할 수 있습니다. 최신 브라우저(구글 크롬, 파이어폭스)들은 URL 길이 제한이 꽤나 넉넉한 편인데요. **구글 크롬 기준 약 32,000자, 파이어폭스는 65,000자나 됩니다.** 이러한 특성을 바탕으로 쿼리스트링을 `state`인 것 처럼 사용하기도 합니다.

## 쿼리스트링(Query String)

먼저 쿼리스트링에 대해 조금만 더 알아볼까요?

쿼리스트링은 **URL(Uniform Resource Locator: 인터넷에서 웹페이지, 이미지, 비디오 등 리소스의 위치를 가리키는 문자열)** 에서 `?` 기호 뒤에 붙는 문자열로, 서버나 클라이언트에 추가적인 정보를 전달하기 위해 사용됩니다.

### 구조 (쿼리스트링의 본질은 문자열이다.)

아래는 쿼리스트링의 구조입니다.

```
https://example.com/search?query=apple&sort=desc&page=2
```

- 기본 URL : `https://example.com/search`
- 쿼리스트링 시작 : `?`
- 첫번째 파라미터 : `query=apple` (검색어는 apple)
- 두번쨰 파라미터 : `sort=desc` (정렬은 내림차순)
- 세번쨰 파라미터 : `page=2` (페이지는 2)

위의 구조에서 볼 수 있듯이 쿼리스트링의 **본질은 문자열** 입니다. 다만 특징이 있는 문자열인 것이지요. 이어서 쿼리스트링의 특징에 대해 알아봅시다.

### 특징

- 쿼리스트링은 `키=값`과 같은 파라미터 형식으로 작성되며, 키는 파라미터 이름이고 값은 그에 해당하는 데이터가 됩니다.
- 여러개의 파라미터를 쓰시는 경우, 각 파라미터는 `&`로 연결할 수 있습니다.
- **쿼리스트링의 순서는 중요치 않습니다.**
- 쿼리스트링에서는 특정 문자(공백, &, ?, = 등)를 사용할 수 없습니다. 이런 문자는 URL 인코딩되어 전달됩니다. 예를 들어 `공백`은 `%20`으로 인코딩됩니다.
- **캐싱에 영향을 줄 수 있습니다.** 브라우저나 서버는 URL 내 쿼리스트링이 달라지면 다른 리소스로 인식하기 때문에 새로운 요청으로 처리합니다.

## URLSearchParams (Web API)

쿼리스트링의 구조와 특징에 대해 배웠습니다. 그 다음 주제로 쿼리스트링을 다루는 기본 툴인 `URLSearchParams`에 대해 짚고 넘어가봅시다. (사실 최종장에서 개발하려는 커스텀 훅이 이 `URLSearchParams` 객체를 조금 더 쓰기 편하게 감싸놓은 형태입니다. 역시나 기본이 가장 중요합니다.)

`URLSearchParams`는 브라우저의 자바스크립트 API에서 제공하는 객체로, URL의 쿼리스트링을 다루기 쉽게 도와주는 유틸리티입니다. 이 객체를 이용하면 URL에 있는 쿼리 파라미터를 손쉽게 추가하거나 수정, 삭제, 조회할 수 있습니다.

### URLSearchParams 사용 예제

쿼리스트링은 문자열이지만 URLSearchParams를 이용하면 쿼리스트링을 객체로써 (정확히는 쿼리 파라미터로써) 쉽게 다룰 수 있습니다.
아래는 URLSearchParams 객체와 메서드를 이용하여 쿼리스트링을 다루는 예제들입니다.

1. URL에서 쿼리스트링 가져오기

```js
/* 이미 존재하는 URL의 쿼리스트링을 가져와 사용할 수 있습니다. */

const url = 'https://example.com?name=John&age=25'
const params = new URLSearchParams(url.split('?')[1])
/* 
['https://example.com', 'name=John&age=25']로 스플릿된 문자열을 이용해 URLSearchParams 객체 생성
 */
```

2. 직접 생성하기

```js
/* 키=값 쌍을 전달해서 URLSearchParams 객체를 생성할 수 있습니다. */

const params = new URLSearchParams({
  name: 'John',
  age: '25'
})
```

3. `get()` - 특정 파라미터 가져오기

```js
// 특정 파라미터 값을 가져옵니다.
console.log(params.get('name')) // 'John'
console.log(params.get('age')) // '25'
```

4. `set()` - 특정 파라미터 값을 설정하거나 이미 존재하는 파라미터 값 수정

```js
// 파라미터가 없다면 새로 만들고, 기존에 존재하면 값을 수정합니다.
params.set('age', '30')
console.log(params.toString()) // 'name=John&age=30'
```

5. `append()` - 동일한 이름의 파라미터를 여러 번 추가

```js
// 쿼리스트링은 말 그대로 스트링이므로 파라미터의 중복을 허용할 수 있습니다..
params.append('hobby', 'reading')
params.append('hobby', 'traveling')
console.log(params.toString()) // 'name=John&age=30&hobby=reading&hobby=traveling'
```

6. `keys()`, `values()`, `entries()` - **이터레이터를 사용하여 순회하기**
   - URLSearchParams 객체는 **이터레이터** 입니다. 즉 다양한 **이터레이터 메서드** 를 이용하여 키값을 순회하면서 처리할 수 있습니다.

```js
// keys() 사용 예시
for (const key of params.keys()) {
  console.log(key) // 'name', 'hobby'
}

// values() 사용 예시
for (const value of params.values()) {
  console.log(value) // 'John', 'reading', 'traveling'
}

// entries() 사용 예시
for (const [key, value] of params.entries()) {
  console.log(key, value)
}
// 출력: 'name John', 'hobby reading', 'hobby traveling'
```

URLSearchParams의 기능에 대해 간략히 알아보았습니다. 여기서 다룬 것 외에도 유용하게 쓸 수 있는 다양한 메서드가 있으니 [mdn 공식문서](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams)를 한번 슥 훑어보는 것도 큰 도움이 될 것입니다.

## [next.js] useQueryParams 커스텀 훅

자 그럼 본격적으로 커스텀 훅을 만들어보겠습니다. (사실은 소스코드 공유에 가깝습니다.)

이 훅을 이해하기 위해서는 URL의 쿼리스트링이 변경되면 브라우저는 새로운 URL로 요청을 보낼 수 있다라는 자명한 특징을 이해하셔야 합니다.
단순히 컴포넌트 내에서 URLSearchParams로 쿼리스트링을 만드는 것은 페이지에 별다른 영향을 주지 않습니다. 생성한 쿼리스트링을 이용해 새로운 페이지로 push해야먄 변경된 쿼리스트링으로 비로소 동작을 하게 됩니다.

```ts
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type UpdateTagObject = {
  [key: string]: string
}

export const useQueryParams = () => {
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

  const getQueryString = (tag: string) => {
    const data = searchParams.get(tag)
    return data
  }

  return {
    setQuertString,
    getQueryString
  }
}
```

URLSearchParams를 한번 감싸 사용하기 편하도록 커스텀 훅으로 만든 코드입니다.
next.js에서 제공하는 useSearchParams 훅을 이용하면 URLSearchParams와 동일한 기능을 사용할 수 있습니다.

- `setQueryString`은 쿼리스트링에 추가될 쿼리 객체를 파라미터로 받습니다. 기존 페이지의 패스네임과 쿼리스트링을 유지한채로 사용자가 정의한 쿼리스트링을 새롭게 붙여준 후 URL을 변경합니다.
- `getQueryString`은 쿼리 파라미터를 문자로 받은 후 해당 파라미터에 따른 값을 리턴합니다.

이 훅을 사용하는 컴포넌트에서는 단순히 아래 코드처럼 선언하고 사용하면 됩니다. 단순히 사용만 하면 알아서 쿼리스트링을 변경한 후 URL을 교체해줍니다.

```ts
// ...
  const { setQuertString, getQueryString } = useQueryParams()
  const tagQueryString = getQueryString('tag') // getter 사용
// ...

  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        setQuertString({ // setter 사용
          tag: title
        })
      }}
      {...props}
    >

```

**URL이 변경되었을 때, 이전 변경점과 pathname이 같을지라도 쿼리스트링의 변경이 감지되면 브라우저 캐싱을 무효화한다는 특성을 잘 이용하여 개발을 하면 될 것 같습니다**

## 참고

1. https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams
2. https://nextjs.org/docs/app/api-reference/functions/use-search-params
3. https://en.wikipedia.org/wiki/Query_string
