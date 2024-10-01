---
title: '[자료구조] 스택의 추상 자료형 및 후위 연산식 활용'
description: '가장 기초적인 자료구조인 스택을 조금 더 면밀히 공부해봅니다.'
thumbnail: '/images/knou.svg'
tags: [자료구조, CS, KNOU]
draft: false
created_date: 2024-09-27 21:15:37
---

# 스택(Stack)의 추상 자료형

자료구조의 정의와 적용 가능 연산을 분명하게 한 것을 **추상 자료형**이라고 합니다. 이 포스팅에서는 스택의 추상 자료형을 다룹니다. 스택의 기본적인 연산을 정리하자면 아래와 같은데요.

- 스택을 생성하는 연산
- 스택이 가득 찼는지 체크하는 연산
- 스택에 자료가 비어있는지 체크하는 연산
- 스택에 자료를 추가하는 연산(Push)
- 스택의 가장 위에 있는 원소를 삭제하고 반환하는 연산(Pop)

이를 추상자료형으로 정리해보겠습니다

<Description title="ADT Stack(배열 추상 자료형)">
- 스택 객체 : 0개 이상의 원소를 갖는 유한 순서 리스트
- 연산 : stack ∈ Stack, item ∈ element, maxStackSize ∈ positive integer인 모든 stack, item, maxStackSize에 대하여 다음과 같은 연산이 정의된다(stack은 0개 이상의 원소를 갖는 스택, item은 스택에 삽입되는 원소, maxStackSize는 스택의 최대 크기를 정의하는 정수).

1. Stack CreateStack(maxStackSize) ::= 스택의 크기가 maxStackSize인 빈 스택을 생성하고 반환한다.
2. Boolean StackIsFull(stack, maxStackSize) ::= <br />
   if ((stack의 element 개수 == maxStackSize)) <br />
   then \{ true 반환 }<br />
   else \{ false 반환}<br />
3. Stack Push(stack, item) ::= <br />
   then \{ stackFull을 출력 } <br />
   else \{ 스택의 가장 위에 item 삽입 후 스택 반환 } <br />
4. Boolean StackIsEmpty(stack) ::= <br />
   then \{ true 반환 }<br />
   else \{ false 반환 }<br />
5. Element Pop(stack) ::= <br />
   then \{ stackEmpty 출력 }<br />
   else \{ 스택의 가장 위에 있는 원소를 삭제하고 반환 }<br />

End Stack
</Description>

위의 추상 자료형에 따라 스택은 자연스레 LIFO(Last In First Out: 나중에 들어온 원소가 제일 먼저 나감) 형태를 띄게 됩니다. 이러한 특성은 운영체제 `서브루틴 호출` 이나 프로그램의 수행 도중 발생되는 `인터럽트의 처리`나 인터럽트 처리가 끝난 후 되돌아갈 `명령 수행 지점을 저장`하기 위해서 사용됩니다. 기초 연산에서는 `후위 수식 계산`에 유용하게 쓰입니다.

## 후위 수식 계산 예제 (자바스크립트)

아래 코드는 후위 연산식을 자바스크립트로 구현한 스택으로 풀어낸 것입니다.

```js
// 연산자는 +, -, *, /만 주어진다고 가정
const exp = '53+82-*4/'

const evalPostfix = (exp) => {
  // 스택 생성 (pop과 push만 사용한다면 배열을 스택으로 써도 아무런 문제가 없음)
  const stack = []

  for (let i = 0; i < exp.length; i++) {
    const cnt = exp[i]

    // 해당 인덱스의 문자가 연산자가 아닐시 스택에 추가
    if (cnt !== '+' && cnt !== '-' && cnt !== '*' && cnt !== '/') {
      stack.push(cnt)
      continue
    }

    // 연산자라면 연산 수행
    // 첫번째로 pop된 수가 두번째 피연산자
    const operand2 = +stack.pop()
    const operand1 = +stack.pop()

    switch (cnt) {
      case '+': {
        stack.push(operand1 + operand2)
        break
      }
      case '-': {
        stack.push(operand1 - operand2)
        break
      }
      case '*': {
        stack.push(operand1 * operand2)
        break
      }
      case '/': {
        stack.push(operand1 / operand2)
        break
      }
    }
  }

  return stack.pop()
}

console.log(evalPostfix(exp)) // (5 + 3) * (8 - 2) / 4 = 12
```

### 정리

스택 자료구조는 특성상 특정 자료의 처리와 그 처리 순서를 기억하는 것에 많이 사용됩니다. LIFO의 특성상 자료의 출입을 특정 틀에 맞게 관리해야 하지만, 오히려 그 점이 높은 유용성과 편리함을 가져다주는 듯 합니다.

## 참고

1. 자료구조(한국방송통신대학교 교재) - 강태원, 정광식 저
