---
title: '리버스 프록시 사용 중 x-forwarded-host header와 origin header 불일치 문제'
description: 'PASS 인증을 개발하다가 만난 cross origin 관련 에러'
thumbnail: ''
tags: ['error', 'nextjs', 'http']
draft: false
created_date: 2025-04-29 23:37:15
---

# 리버스 프록시 헤더 불일치 문제

## 상황

1. PASS 인증 구현을 위해 새창을 띄워 form actions을 사전에 정의된 URL로 보냈다.

2. PASS 인증 창이 정상적으로 렌더링되었고, 정상적으로 인증 과정을 마쳤다.

3. 인증을 마친 PASS 새창은 서버에서 정의한 Redirect URL로 주소가 변경된다.

- 테스트를 위해 Redirect URL은 Cloudflare 리버스 프록시 서버를 사용하였다.

4. 아래 에러가 나오며 새창의 주소가 정상적으로 변경되지 않았다.

```
x-forwarded-host header with value `something.cloudflare.com`
does not match origin header with value `PASS-AUTH.com`
from a forwarded Server Actions request. Aborting the action.
```

## 원인

1. 새창의 origin header는 PASS-AUTH.com인 상황이다.

2. 인증이 성공적으로 마무리된 후 전달받는 HTTP의 x-forwarded-host header는 something.cloudflare.com 이다.

3. Cloudflare는 리버스 프록시 역할을 하고, x-forwarded-host header에 something.cloudflare.com을 담은 것이다.

4. origin header와 x-forwarded-host header의 값이 다를 경우, Next.js에서는 보안 이슈로 통신을 차단한다.

## 해결

```ts
// next.config.ts
serverActions: {
    allowedOrigins: [
        'PASS-AUTH.com',
    ],
}
```

이 설정은 Next.js가 Server Actions 요청을 수락할 수 있는 "허용된 Origin 도메인"을 명시하는 역할을 한다.

### 🔐 왜 이 설정이 필요한가?

기본적으로 Next.js는 Server Actions 요청 시 아래 두 조건을 자동 검사한다:

Origin 헤더의 값이 "보안상 허용된 도메인"인지

x-forwarded-host와 Origin이 일치하는지 (또는 동일한 allowedOrigins 내에 있는지)

리버스 프록시를 거치는 상황에서는 이 두 값이 다를 수 있기 때문에, Next.js는 기본적으로 해당 요청을 "출처가 다르다"며 차단한다.

### ✅ 이 설정이 해결해주는 것

설정을 추가하면 Next.js는 아래처럼 동작한다.

1. 새 창에서 PASS 인증 성공 후, 브라우저가 Origin: PASS-AUTH.com을 가진 요청을 보냄

2. Cloudflare 리버스 프록시가 이 요청을 중계하며 x-forwarded-host: something.cloudflare.com 헤더를 붙임

3. Next.js는 요청을 받았을 때:

- `Origin`: PASS-AUTH.com

- `x-forwarded-host`: something.cloudflare.com 이

둘이 일치하지 않지만, PASS-AUTH.com이 allowedOrigins에 있으므로 허용한다.

즉, 이 설정은 다음 검사를 완화한다.

❌ origin !== x-forwarded-host `→` 차단

✅ origin ∈ allowedOrigins `→` 통과

### 더 공부해보면 좋을 것들

1. 리버스 프록시 구현해보기

2. HTTP PROTOCOL 관련 서적 읽어보기
