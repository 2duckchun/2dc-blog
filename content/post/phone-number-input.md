---
title: '[구현] PhoneNumberInput 만들기'
thumbnail: '/images/react.png'
tags: ['frontend', '구현']
draft: false
created_date: 2025-01-02 21:07:01
---

# PhoneNumberInput

PhoneNumberInput 컴포넌트는 아래의 요구사항을 충족하여 개발해야 한다고 가정하겠습니다.

1. 사용자는 PhoneNumberInput에 숫자만 입력할 수 있다.
2. 따라서 `onFocus` 상태에서는 Input에 숫자만 표현되고 입력되어야 한다.
3. `onBlur` 상태(포커싱을 잃은 상태)에서는 숫자들이 휴대폰 포맷에 맞게 변환되어 표현되어야 한다. `(ex) 010-1234-5678`
4. `onBlur`, `onFocus` 상태에 따라 포맷이 2번, 3번과 같이 변할 수 있어야 한다.
5. 상위 컴포넌트는 PhoneNumberInput을 일반적인 input처럼 여기고 사용할 수 있어야한다. (재사용성 향상 조건)

## 구현 코드

구현 코드부터 공유하고 아래에 해석을 이어가겠습니다.

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

중요한 것은 PhoneNumberInput은 일반적인 input을 확장한다는 것입니다. 따라서 해당 컴포넌트의 사용 방법 또한 일반 input을 사용하는 것과 크게 차이가 나면 안됩니다. 그러므로 onChange나 onBlur 등 구체화가 필요한 요소들을 props로 받되, 내부에서 핸들러로 한번 감싸서 필요한 기능을 구현해줄 필요가 있습니다.

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

input 태그를 보시겠습니다.

- onChange에는 handleOnChange가 연결되어 있습니다. handleOnChange는 `e.target.value`를 인자로 받아 숫자를 제외한 모든 문자를 제거하고, 그 값을 이용해 부모로부터 props로 전달받은 onChange를 호출합니다.

- onFocus에는 handleOnFocus가 연결되어있고, Focus시 실행이 필요한 코드를 호출합니다.

- onBlur에는 handleOnBlur가 연결되어있고, Blur시 실행이 필요한 코드를 호출합니다.

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

일반 Input 태그가 사용하는 어트리뷰트인 onChange와 value를 props 이름으로 그대로 사용하였고, 이를 통해 가독성 및 유지보수성을 크게 높힐 수 있게 되었습니다. 해당 컴포넌트를 다른 Input으로 교체해야할 일이 생겼을 때 작업이 정말 편해지겠지요.

## 후기

사실 어려울 것은 없는 구현이고, 이런 코드들은 GPT가 너무나도 잘 짜줍니다. 하지만 이런 쉬운 구현도 AI에게 의존하고 있었구나라는 생각이 문득 들었습니다. 생산성을 위해 AI에 충분히 의존할 수 있는 부분일 수도 있겠지만, 그래도 여유시간이 있을 때 외부 의존 없이 코드를 스스로 짜보는 습관을 들여보고자 합니다.
