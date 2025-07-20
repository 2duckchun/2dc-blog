---
title: '[JS] 브라우저가 Timezone이 명시되지 않은 Date String을 사용했을 때 벌어지는 일'
description: '시간 표준이 명시되지 않은 Date String을 Date 객체로 파싱할 경우, 브라우저마다 다르게 해석되어 시간 오차 이슈가 발생할 수 있습니다.'
thumbnail: '/images/javascript.svg'
tags: ['javascript', 'study']
draft: false
created_date: 2025-07-20 16:20:30
---

# 브라우저가 Timezone이 명시되지 않은 Date String을 사용했을 때 벌어지는 일

Timezone이 없는 Date String을 사용하면 시간대가 브라우저마다 다르게 해석되는 난감한 상황에 처할 수 있다.
이번 포스팅에서는 Timezone에 대한 문제 발생과 분석, 해결 과정에 대한 기록을 남겨보고자 한다.

## 사전 지식

### UTC란?

UTC는 '협정 세계시'를 뜻하는 Coordinated Universal Time의 약자다. 전 세계적으로 사용되는 표준시로, 1972년부터 시행되었으며, 원자시계를 기반으로 하는 매우 정확한 시간 체계이다.

### UTC 문자열 표현

```js
'2025-07-18T14:47:21.283Z'
```

Date String의 밀리초 뒤에 `Z`를 붙이면 해당 시간은 UTC 기준이 된다.

### Timezone 보정

```js
'2025-07-18T14:47:21.283+09:00' // 한국
'2025-07-18T14:47:21.283-04:00' // 뉴욕
```

Date String의 밀리초 뒤에 + 또는 -로 오프셋을 넣어주면, 이 문자열이 어느 타임존 기준인지를 명시할 수 있다.

- 한국은 UTC보다 9시간 빠르므로 +09:00
- 뉴욕은 UTC보다 4시간 느리므로 -04:00

## 문제 발생

미국에 있는 유저가 앱의 특정 부분을 이용할 수 없다는 문의가 들어왔다. 코드를 분석해보니 서버로부터 받는 날짜에 타임존이나 UTC가 명시되지 않은 상태였다.

```js
'2025-07-18T14:47:21.283'
```

## 문제 분석

<Hint> **(MDN) Note** : While the time value at the heart of a Date object is UTC, the basic methods to fetch the date and time or its components all work in the local (i.e., host system) time zone and offset.</Hint>

> 브라우저의 Date 객체는 운영체제의 시스템 시간을 기준으로 동작한다.

오프셋이 있는 문자열을 new Date()로 파싱하면 해당 오프셋 기준의 UTC 시각으로 정확히 변환되지만, 타임존 정보가 없는(naive) 문자열을 파싱하면 브라우저가 실행 중인 운영체제의 로컬 타임존 기준으로 해석한다.

예를 들어 아래와 같다.

```js
// 한국 브라우저 (KST, UTC+9)
new Date('2025-07-18T14:47:21.283').toString()
// → "Fri Jul 18 2025 14:47:21 GMT+0900 (Korean Standard Time)"
// 내부 UTC로는 "2025-07-18T05:47:21.283Z"

// 뉴욕 브라우저 (EDT, UTC−4)
new Date('2025-07-18T14:47:21.283').toString()
// → "Fri Jul 18 2025 14:47:21 GMT-0400 (Eastern Daylight Time)"
// 내부 UTC로는 "2025-07-18T18:47:21.283Z"
```

재밌는 점은, **날짜가 화면단에 표시될 때, 서울이나 뉴욕이나 같은 “2025-07-18 14:47”로 보이지만, 실제로는 각기 다른 UTC 순간을 가리키기 때문에 내부 로직은 완전 이상하게 동작한다는 것이다.**

때문에 **프론트는 이상없는거 같은데 왜 안됨? 과 같은 뒷골이 뜨뜻한 상황이 만들어진다.**

## 문제 해결

프론트엔드에서 “이 문자열은 서울 시간”이라고 강제로 명시해 주기로 했다.

```js
'2025-07-18T14:47:21.283+09:00'
```

이렇게 하면 어떤 브라우저에서든
`2025-07-18T14:47:21.283+09:00`을 동일한 순간인 UTC 기준 날짜 `2025-07-18T05:47:21.283Z`로 파싱하므로 만료(true/false) 로직이 일관되게 동작한다.

하지만 근본적인 해결 방법은 아니라고 생각된다. 해당 DB를 사용하는 모든 앱에서 타임존 보정을 해주어야만 하기 때문이다. 문제를 근본적으로 해결하는 방법은 서버에서 내려주는 시간 데이터를 KST로 보정해서 내려주거나, 저장된 모든 시간값들을 UTC로 변경해서 관리하는 것이다.

## 참고

1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
