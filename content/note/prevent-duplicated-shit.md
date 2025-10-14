---
title: 'useEffect 내부에 중복 동작을 방지하는 코드를 넣을 때 주의할 점'
description: '별 것도 아닌 것으로 몇십분을 헤멘 것은 그게 별것이 아니기 때문이다.'
thumbnail: ''
tags: ['react', 'mistake']
draft: false
created_date: 2025-10-14 12:39:28
---

# useEffect 내부에 중복 동작을 방지하는 코드를 넣을 때 주의할 점

의존성 배열에 따라 `useEffect`는 여러 번 호출될 수 있다.

만약 `useEffect`에서 **의존성 배열의 상태 변화는 감지해야 하지만, 내부 로직은 단 한 번만 실행되어야 하는 경우**는 어떨까?

예를 들어, `message` 이벤트를 대기하는 이벤트 리스너를 등록하는 경우를 생각해보자.

```ts
useEffect(() => {
  const handleDoneMessage = async (event: MessageEvent) => {
    if (!isValidMessageEvent(event) || !someId) return

    if (isHandled.current) return
    isHandled.current = true

    const someResult = await doSomething({ data })

    if (someResult.status !== COMMON_META_CODE.SUCCESS) {
      toast(someResult.message)
      return
    }

    const { name, phone, birthdate } = someResult.data ?? {}

    onSuccess({
      name: name ?? '',
      phone: phone ?? '',
      birthdate: birthdate ?? ''
    })
  }

  window.addEventListener('message', handleDoneMessage)
  return () => {
    window.removeEventListener('message', handleDoneMessage)
  }
}, [onSuccess, someId, doSomething])
```

이 이벤트는 한 번만 동작해야 한다고 가정하자.

useEffect는 onSuccess, someId, doSomething이 변경될 때마다 다시 실행된다.
이 세 값 중 하나라도 최신화되지 않으면 이벤트 리스너에 등록된 핸들러가 오래된 상태를 참조하게 된다.
그래서 의존성 배열은 꼭 넣어야 하지만, 그로 인해 의도치 않게 handleDoneMessage가 여러 번 실행될 가능성이 생긴다.

이럴 때 useRef를 활용해 “이미 처리된 이벤트인지”를 마킹하는 플래그를 둘 수 있다.
즉, 한 번 처리된 이후에는 더 이상 로직이 실행되지 않도록 하는 것이다.

---

## ⚠️ 중요한 점

여기서 핵심은 **“함수가 실행되었다는 사실을 기록하는 것”**과
**“그 기록을 확인하는 시점”**을 혼동하지 않는 것이다.

isHandled.current = true는 **“이제부터는 다시 실행하지 말라”**는 마킹이지만,
이 코드가 실제 비즈니스 로직보다 너무 앞서 실행된다면 문제가 된다.
즉, 어떤 이유로 doSomething이 실패하거나 await 이전에 예외가 발생하더라도
이미 isHandled가 true로 되어버리면 이후 정상적인 재시도조차 막히게 된다.

## ✅ 정리하자면

- useEffect 내부에서 중복 실행을 막을 때는 한 번만 동작해야 하는 ‘로직’의 경계를 명확히 해야 한다.
- useRef를 통한 플래그는 **“함수 실행이 완료된 이후”**에 설정하는 것이 안전하다.
- “한 번만 실행되어야 한다”는 의도를 구현할 때는 **“언제 한 번으로 간주할지”**를 명확히 정의해야 한다.

작은 디테일이지만, 이런 부분에서 몇십 분을 날리기 쉽다.
useEffect의 실행 시점과 “상태의 마킹”이 섞이면,
의도치 않게 “필요한 로직이 한 번도 실행되지 않는” 상황이 생길 수 있다.

결국 중복 방지보다 중요한 건, 언제 그 방지를 시작해야 하는가다.
