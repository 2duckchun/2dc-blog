---
title: '[JS] 자바스크립트 에러 클래스와 커스텀 에러 만들기'
description: '우리는 에러 클래스를 잘 쓰고 있었을까요? 무턱대고 new Error만 쓰지는 않았을까요? 이 게시글에서는 에러를 자유자재로 다룰 수 있도록 에러 클래스와 커스텀 에러 클래스에 대해 소개합니다.'
thumbnail: '/images/javascript.svg'
tags: [자바스크립트]
draft: false
created_date: 2024-09-28 22:42:15
---

# 에러 클래스

여러분은 fetch와 try catch문을 함께 쓰실 때 보통 어떻게 쓰시나요? 아마 개발 경험이 많지 않으신 분이라면 높은 확률로 아래처럼 쓰실 수도 있을 것 같습니다.

```js
try {
  const response = await fetch(`https://...`)
  if (!response.ok) {
    throw new Error('특정 이유로 fetch가 실패했습니다.')
  }
  return response.json() // ... 기타등등
} catch (err) {
  throw new Error('알 수 없는 이유로 에러가 났습니다.')
}
```

위의 코드는 에러를 잡아내는 것에는 충실할지 모르겠지만 중대한 하자가 존재합니다. **이 try catch문에서 에러는 최종적으로 catch문의 에러만 동작하게 되는데요.**
try문 내부에서 생성된 에러 객체가 catch에 잡히게 되면서 또 다시 새로운 에러 객체가 생성되기 때문입니다. 즉, 서버에서 전달받은 에러 정보를 사용하기가 어렵게 됩니다.

그러한 일을 방지하기 위해 우리는 new Error만 쓸 것이 아니라, 에러 클래스를 직접 커스텀해서 쓸 수 있어야 합니다. 다행히도 에러 클래스를 만드는 과정이 그리 어렵지 않으니 한번 따라해보시죠!

## 에러 클래스, 에러 인스턴스

### 에러 클래스

에러 클래스는 자바스크립트에서 기본적으로 제공하는 오류를 나타내는 클래스입니다. 이 클래스는 모든 에러 객체의 기본 클래스이며, 표준 오류 메세지와 에러의 흔적을 저장한 스택을 포함한 객체를 생성합니다.
에러 클래스의 정확한 코드는 알 수 없으나, 슈도 코드로 표현하면 아래와 같습니다.

```js
// 출처 : https://ko.javascript.info/custom-errors
// 자바스크립트 자체 내장 에러 클래스 Error의 '슈도 코드'

class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (name은 내장 에러 클래스마다 다릅니다.)
    this.stack = <call stack>;  // stack은 표준은 아니지만, 대다수 환경이 지원합니다.
  }
}
```

이 기본 에러 클래스를 통해 에러 인스턴스를 만들었을 경우, 아래와 같은 방식으로 에러 인스턴스를 사용할 수 있게 됩니다.

```js
const error = new Error('에러 메시지')
console.log(error.message) // "에러 메시지"
console.log(error.stack) // 에러 발생 위치 등의 정보 출력
```

### 에러 인스턴스

에러 인스턴스는 에러 클래스를 기반으로 생성된 객체입니다. new 키워드를 사용하여 Error 클래스 또는 커스텀 에러 클래스를 호출할 때 생성되는 객체라고 할 수 있습니다.

```js
const errorInstance = new Error('에러 메시지')
```

일반적으로 에러 인스턴스를 사용할때는 throw문을 통해 예외를 발생시키고 try ..catch 블록에서 포착해 에러를 처리합니다.

```js
try {
  throw new Error('에러가 발생했습니다!')
} catch (error) {
  console.log(error.message) // "에러가 발생했습니다!"
  console.log(error.name) // "Error"
  console.log(error.stack) // 스택 트레이스 출력
}
```

### 빌트인 에러 클래스 종류

자바스크립트는 생각보다 여러 종류의 기본 에러 클래스를 제공하는데요.

- `Error`: 모든 에러의 기본 클래스
- `TypeError`: 잘못된 타입이 사용될 때 발생
- `ReferenceError`: 정의되지 않은 변수를 참조할 때 발생
- `SyntaxError`: 구문이 잘못되었을 때 발생
- `RangeError`: 값이 허용된 범위를 벗어날 때 발생

이를 통해 다양한 상황에 맞는 에러를 발생시키고 처리할 수 있습니다.

## 커스텀 에러(에러 클래스의 확장)

에러 클래스는 클래스로 구성되어 있으므로, 자연스럽게 확장(extends) 문법도 사용 가능합니다.
아래는 제가 최근에 만들어 사용한 커스텀 에러인데요. 코드를 공유하고 하나하나 설명드리겠습니다.

```ts
export class ResponseError extends Error {
  statusCode: number
  constructor({
    statusCode,
    message
  }: {
    statusCode: number
    message: string
  }) {
    super(message)
    this.statusCode = statusCode || 500
    this.name = this.constructor.name || 'Response Error'

    // Node.js 환경에서 스택 트레이스 캡처
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
```

- `ResponseError` 커스텀 에러는 서버로부터 전송받은 에러 객체를 캐치하여, 서버의 의도를 프론트엔드에 조금 더 자세히 보여주기 위해 제작되었습니다.
- 이를 위해 기존의 에러 클래스의 필드에 `statusCode` 를 추가하여 에러 인스턴스가 서버에서 받은 상태 코드를 보유할 수 있게 했습니다.
- 인스턴스를 생성할 때 파라미터로 message와 statusCode를 키값으로 하는 **객체**를 받게 했습니다.
- super()를 통해 부모 커스텀 클래스에서 message를 처리할 수 있도록 했습니다. **이 과정이 없다면 에러 인스턴스의 메세지가 비어있는 등 에러가 정상적으로 처리되지 않습니다.**
- 에러 인스턴스의 name 필드에 생성자 이름을 명시하여 커스텀 에러의 이름이 무엇인지 확실히 했습니다. (여기서는 `Response Error`이 에러 인스턴스 이름이 됩니다.)
- 브라우저에는 에러 스택이 자동적으로 this.stack에 저장이 되지만, Node.js에서는 그렇지 않습니다. 따라서 Error.captureStackTrace 메서드를 이용하여 에러가 생성된 곳에 대한 정보를 추적할 수 있도록 했습니다. (저는 Next.js를 주로 활용하기 때문에 Node.js 환경도 고려를 해주어야 했습니다.)
- 아래 사진이 `stackTrace` 입니다. <img width="1000" alt="image" src="https://github.com/user-attachments/assets/f5d82865-5a40-41de-857a-76ca9421e7a6" />

## 활용법

커스텀 에러를 잘 활용하려면 `instanceof 연산자` 를 반드시 알고 계셔야 합니다.
instanceof 연산자를 잘 활용하면 캐치된 에러가 어떤 클래스를 통해 만들어졌는지 확인하여 해당 에러에 따른 분기처리를 할 수 있게 됩니다.

```ts
export const R_fetcher = async <T extends unknown>({
  url,
  options,
  useToken = false
}: FetcherPropsType): Promise<ResponseSuccessed<T>> => {
  if (useToken) {
    const accessToken = 'ez035DEx.Ed...'
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`
    }
  }

  try {
    const response = await fetch(url, { ...options })
    // Request가 서버에 도달했으나 Response에서 에러를 전송한 경우
    if (!response.ok) {
      const errorData = (await response.json()) as ResponseFailed
      // 커스텀 에러 생성
      throw new ResponseError({
        statusCode: errorData.statusCode || 500,
        message: errorData.errorMessage || 'An unknown error occurred'
      })
    }
    const data = await response.json()
    return data
  } catch (error) {
    // 에러가 ResponseError의 인스턴스인 경우 해당 에러를 그대로 throw 한다.
    if (error instanceof ResponseError) throw error
    // Request가 서버에 도달하지 못한 경우, 새로운 에러 객체를 생성한다. (fetch failed)
    else throw new Error('fetch failed')
  }
}
```

## 주의할 점

**풀스택 프레임워크(ex. Next.js)를 사용하시는 경우, 특히 Next.js의 Server Action을 애용하시는 분이라면 instanceof 연산자를 통한 에러의 감지가 잘 되지 않을 수 있습니다.** 코드상에서 같은 커스텀 에러 객체를 쓴다 하더라도 Node.js 환경과 브라우저 환경이 다르기 때문에 서로간에 어떤 커스텀 에러를 썼는지 감지하지 못하는 것이죠. 내 코드가 어느 환경에서 동작하는지 면밀히 생각해보고 커스텀 에러를 적용해야 디버깅 시간이 줄어들겠습니다.

## 참고

1. https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error
2. https://ko.javascript.info/error-handling
3. https://ubermensch-with.tistory.com/963
