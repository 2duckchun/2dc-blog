---
title: '[구현] PhoneNumberInput 만들기'
description: '숫자를 입력하면 자동으로 휴대폰 번호 포맷으로 변환해주는 input 컴포넌트를 만들어봅니다.'
thumbnail: '/images/react.png'
tags: ['frontend', 'implementation']
draft: false
created_date: 2025-01-02 21:07:01
---

# PhoneNumberInput

PhoneNumberInput은 사용자가 번호를 입력한 후 blur 상태가 되면 번호를 휴대폰 번호 포맷으로 자동 변환하는 input 확장 컴포넌트입니다. 이 컴포넌트는 다음과 같은 요구사항을 충족해야 합니다:

## 요구사항

1. **숫자만 입력 가능**

   - 사용자는 PhoneNumberInput에 숫자만 입력할 수 있습니다.
   - onFocus 상태에서는 입력 필드에 숫자만 표시되며, 입력된 값도 숫자만 허용됩니다.

2. **포맷 변환**

   - 입력 필드가 onBlur 상태(포커스를 잃은 상태)가 되면, 입력된 숫자가 휴대폰 번호 포맷(ex: 010-1234-5678)에 맞게 변환되어 표시됩니다.

3. **동적 포맷 변경**

   - onFocus 상태에서는 입력 필드가 순수 숫자로 표시되고, onBlur 상태에서는 휴대폰 번호 포맷으로 변경되는 동작을 수행해야 합니다.

4. **포맷 변환**

   - 상위 컴포넌트는 PhoneNumberInput을 일반적인 input처럼 사용할 수 있어야 합니다.
   - Props로 onChange, value 등을 그대로 전달할 수 있어야 하며, 기존 코드와의 호환성을 유지해야 합니다.

## 구현 코드

아래는 구현 코드입니다.

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

이 컴포넌트는 일반적인 input 태그를 휴대폰 번호 포맷 기능을 수행할 수 있도록 확장 및 구체화한 것입니다. 따라서 컴포넌트의 타입을 아래와 같이 구성할 수 있습니다.

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement>

interface PhoneNumberInputProps
  extends Omit<InputProps, 'onChange' | 'onBlur'> {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}
```

기본적으로 제공하는 input 엘리먼트를 확장하는 것 처럼 구현하기 위해 타입을 위와 같이 구성했습니다. React의 InputHTMLAttributes 제네릭을 활용하였으며, 이를 통해 해당 컴포넌트를 호출하는 상위 컴포넌트에서는 일반 input에 props를 전달하는 것 처럼 해당 컴포넌트를 사용할 수 있게 됩니다.

단 필요한 기능을 구현하기 위해 `onChange`나 `onBlur` 등 구체화가 필요한 요소들을 props로 받되, 해당 핸들러를 한번 감싸서 처리 해줄 필요가 있습니다.

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

1.  **`onChange` 이벤트**

    - onChange에는 handleOnChange 함수가 연결되어 있습니다.
    - 이 함수는 e.target.value에서 숫자가 아닌 모든 문자를 제거한 값을 계산합니다. 처리된 값을 부모 컴포넌트로부터 전달받은 onChange 함수에 넘겨줍니다.

2.  **`onFocus` 이벤트**

    - onFocus에는 handleOnFocus 함수가 연결되어 있습니다.
    - 입력 필드에 포커스가 발생하면, 기존 value 값에서 숫자가 아닌 문자를 모두 제거한 값으로 변환해 부모의 onChange를 호출합니다.

3.  **`onBlur` 이벤트**

    - onBlur에는 handleOnBlur 함수가 연결되어 있습니다.
    - 입력 필드에서 포커스가 해제되면, 현재 입력된 value 값을 formatPhoneNumber 함수로 처리해 포맷된 값으로 변환한 뒤 부모의 onChange를 호출합니다.

아래는 컴포넌트 사용 예시입니다.

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

PhoneNumberInput에서 **onChange**와 **value**를 일반적인 input 태그의 속성이자 props 이름으로 그대로 사용한 점이 핵심입니다.

장점
이 방식은 PhoneNumberIndex 컴포넌트를 다른 input 컴포넌트로 대체하더라도 동일한 onChange와 value를 사용할 수 있어 부모 컴포넌트 입장에서 수정 작업이 최소화됩니다. 결과적으로 유지보수성과 코드 가독성을 높이는 효과를 얻을 수 있습니다.

## 회고

이번 구현은 특별히 어려운 부분이 없는 비교적 간단한 작업입니다. 물론 GPT 같은 도구로도 쉽게 구현 가능한 코드입니다. 하지만 이런 방식으로 컴포넌트를 설계하고 작동 방식을 이해하는 것이 중요합니다. 이해하고 나니 개발이 더욱 재미있어지네요. 개발을 즐기며 한 걸음씩 나아갑시다.
