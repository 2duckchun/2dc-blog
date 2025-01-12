---
title: '[구현] PhoneNumberInput 만들기'
description: '즐거운 확장 Input 컴포넌트 만들기 시간입니다.'
thumbnail: '/images/react.png'
tags: ['frontend', '구현']
draft: false
created_date: 2025-01-02 21:07:01
---

# PhoneNumberInput

PhoneNumberInput 컴포넌트는 아래의 요구사항을 충족해야 한다고 가정하겠습니다.

1. 사용자는 **PhoneNumberInput** 에 숫자만 입력할 수 있다. (`onFocus` 상태에서는 Input에 숫자만 표현되고 입력되어야 한다.)
2. `onBlur` 상태(포커싱을 잃은 상태)에서는 숫자들이 휴대폰 포맷에 맞게 변환되어 표현되어야 한다. `(ex) 010-1234-5678`
3. `onBlur`, `onFocus` 상태에 따라 포맷이 1번, 2번과 같이 변할 수 있어야 한다.
4. 상위 컴포넌트는 PhoneNumberInput을 일반적인 input처럼 Props를 전달할 수 있어야 한다.

## 구현 코드

코드를 공유하고, 해석을 이어가겠습니다.

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement>

interface PhoneNumberInputProps
  extends Omit<InputProps, 'onChange' | 'onBlur'> {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const PhoneNumberInput = ({
  className,
  onChange,
  value = '',
  ...props
}: PhoneNumberInputProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unfomattedValue = e.target.value.replace(/[^0-9]/, '')
    if (onChange) onChange(unfomattedValue)
  }

  const handleOnFocus = () => {
    const unfomattedValue = value.replace(/[^0-9]/g, '')
    if (onChange) onChange(unfomattedValue)
  }

  const handleOnBlur = () => {
    const formattedValue = formatPhoneNumber(value)
    if (onChange) onChange(formattedValue)
  }

  return (
    <input
      type="tel"
      className={className}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      maxLength={11}
      value={value}
      {...props}
    />
  )
}
```

```ts
// format utils function
export const formatPhoneNumber = (value: string) => {
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (value.length === 10) {
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  } else {
    return value
  }
}
```

```tsx
// 컴포넌트 사용
import { useState } from 'react'
import { PhoneNumberInput } from '@/components/ui/PhoneNumberInput'

export const PhoneNumberIndex = () => {
  const [value, setValue] = useState('')
  return (
    <main>
      <PhoneNumberInput onChange={setValue} value={value} />
    </main>
  )
}
```

### 해석

이 컴포넌트는 일반적인 input 태그를 확장 및 구체화한 것입니다. 따라서 컴포넌트의 인터페이스를 다음과 같이 구성할 수 있습니다.

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement>

interface PhoneNumberInputProps
  extends Omit<InputProps, 'onChange' | 'onBlur'> {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}
```

현재 컴포넌트는 React JSX 문법을 사용하므로 React의 InputHTMLAttributes를 사용하여 위와 같이 InputProps 타입을 만들었습니다.

중요한 것은 PhoneNumberInput은 일반적인 input을 확장한다는 것입니다. 따라서 해당 컴포넌트의 사용 방법 또한 일반 input을 사용하는 것과 크게 차이가 나면 안됩니다. 그러므로 `onChange`나 `onBlur` 등 구체화가 필요한 요소들은 상위 컴포넌트에서 props로 받되, 내부에서 핸들러로 한번 감싸서 필요한 기능을 구현해줄 필요가 있습니다.

```tsx
export const PhoneNumberInput = ({
  className,
  onChange,
  value = '',
  ...props
}: PhoneNumberInputProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unfomattedValue = e.target.value.replace(/[^0-9]/, '')
    if (onChange) onChange(unfomattedValue)
  }

  const handleOnFocus = () => {
    const unfomattedValue = value.replace(/[^0-9]/g, '')
    if (onChange) onChange(unfomattedValue)
  }

  const handleOnBlur = () => {
    const formattedValue = formatPhoneNumber(value)
    if (onChange) onChange(formattedValue)
  }

  return (
    <input
      type="tel"
      className={className}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      maxLength={11}
      value={value}
      {...props}
    />
  )
}
```

이렇게 되면 상위 컴포넌트는 `onChange` 등의 이벤트 함수를 그대로 넘겨주는 형태가 됩니다. 하위 컴포넌트에서는 props로 전달받은 `onChange` 에 전반적인 처리를 한 값을 넘겨줄 수 있습니다.

input 태그를 보시겠습니다.

- `onChange`에는 handleOnChange가 연결되어 있습니다. handleOnChange는 `e.target.value`를 인자로 받아 숫자를 제외한 모든 문자를 제거하고, 그 값을 이용해 부모로부터 props로 전달받은 `onChange`를 호출합니다.

- `onFocus`에는 handleOnFocus가 연결되어있고, Focus시 실행이 필요한 코드를 호출합니다.

- `onBlur`에는 handleOnBlur가 연결되어있고, Blur시 실행이 필요한 코드를 호출합니다.

따라서 부모 컴포넌트는 PhoneNumberInput를 아래와 같이 이용할 수 있습니다.

```tsx
export const PhoneNumberIndex = () => {
  const [value, setValue] = useState('')
  return (
    <main>
      <PhoneNumberInput onChange={setValue} value={value} />
    </main>
  )
}
```

일반적인 input 태그가 사용하는 어트리뷰트인 onChange와 value를 props 이름으로 그대로 사용하였다는 점이 중요할 것 같습니다. PhoneNumberIndex 컴포넌트를 다른 input 컴포넌트로 바꾸더라도 부모 컴포넌트 입장에서는
여전히 동일한 props를 내려줄 수 있기 떄문입니다. 이는 유지보수성이나 코드 가독성을 높일 수 있는 방법 중 하나입니다.

## 후기

어려울 것은 없는 구현이고, GPT가 잘 짜주는 코드이기도 합니다. 하지만 이런식으로 구현을 하는구나 정도는 이해하고 있어야 개발이 즐거운 것 같습니다. 즐겁네요.
