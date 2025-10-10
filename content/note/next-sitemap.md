---
title: '[next.js] 정적 페이지 빌드 시 Dynamic Function을 잘못 사용하면 빌드 에러가 발생한다.'
description: 'next.js에서 문서화한 DynamicServerError 에러와 연관이 있습니다.'
thumbnail: '/images/nextjs.png'
tags: ['frontend']
draft: false
created_date: 2025-09-29 21:12:05
---

# 정적 페이지 빌드 시 Dynamic Function 잘못 사용하면 빌드 에러 발생

빌드 중 sitemap.xml을 생성하고 있을 때 다음과 같은 에러가 발생했다.

```bash
Error: Dynamic server usage: Route /sitemap.xml couldn't be rendered statically because it used `cookies`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
```

공식문서에서 설명하는 에러 원인은 아래와 같았다.

### [**Why This Message Occurred**](https://nextjs.org/docs/messages/dynamic-server-error#why-this-message-occurred)

- You attempted to use a Next.js function that depends on Async Context (such as `headers` or `cookies` from `next/headers`) but it was not bound to the same call stack as the function that ran it (e.g., calling `cookies()` inside of a `setTimeout` or `setInterval`).

- While generating static pages, Next.js will throw a `DynamicServerError` if it detects usage of a dynamic function, and catch it to automatically opt the page into dynamic rendering. However, when it's uncaught, it will result in this build-time error.

대략적으로 정리해보면...

- Next.js가 정적 페이지 컴포넌트를 호출하여 정적 페이지를 빌드할 때, Dynamic Function(`headers()`, `cookies()` 등)을 감지하면 `DynamicServerError` 에러를 던지고, 이 에러를 감지해서 동적 페이지 렌더링으로 강제 전환한다.

- 그러나, 정적 페이지 컴포넌트(함수)의 콜스택을 벗어난 상태에서 호출된 `DynamicServerError`는 별도로 감지하지 못하고 다른 콜스택의 에러 바운더리에서 감지되어 빌드 에러로 이어진다.

## 원인

- sitemap.xml에 블로그 상세 페이지 등을 넣기 위해 API를 호출하는 코드가 있었는데, API 호출 코드 내부에서 `headers()`를 사용하고 있었음.
- sitemap.xml은 기본적으로 정적 페이지로 다루어짐.
- 따라서 빌드할때마다 동적 함수 감지 에러가 남.

## 해결

- sitemap 등 정적 빌드가 필요하되, API를 호출해야 하는 상황에서는 `headers()`를 실행하지 않도록 코드를 수정함
