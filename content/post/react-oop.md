---
title: 'React에 적용해보는 객체지향 SOLID 원칙'
description: '객체지향 설계에 적용되는 5가지 원칙을 리액트에도 적용할 수 있을까요?'
thumbnail: '/images/react.png'
tags: ['frontend']
draft: false
created_date: 2024-11-27 22:37:43
---

# React에 적용해보는 객체지향 SOLID 원칙

SOLID 원칙은 객체지향에서 좋은 코드를 짜기 위한 일종의 가이드라인이라고 볼 수 있습니다.
이 원칙은 프로그래밍 설계에 갑자기 뿅 하고 등장한 개념은 아닙니다. 많은 선배 개발자들이 좋은 코드는 어떠한 특징을 가지고 있을까? 라는 주제로 양질의 코드들을 분석하다가
**유지보수가 쉬운 클래스들은 SOLID에 기반하는 원칙을 지키고 있다** 라는 개념으로 점차 발전해 나갔다고 합니다.

사실 SOLID는 클래스를 잘 만들기 위한 원칙입니다. 이러한 원칙이 함수형 컴포넌트를 주로 만드는 리액트에도 적용이 될 수 있을까요?
물론 적용될 수 있습니다. 중요한 것은 코드가 클래스냐, 함수냐를 따지는 것이 아니라 얼마나 유지보수성과 개발 용이성이 보장되는 코드를 생성하느냐 이니까요.

그럼 SOLID 원칙과, 해당 원칙을 응용한 리액트 코드를 보면서 함께 생각의 지변을 넓혀보는 시간을 가져보도록 하겠습니다.

## 단일 책임 원칙(Single Responsibility Principle, SRP)

SRP는 **하나의 클래스는 하나의 책임만 진다.** 라고도 해석할 수 있습니다.
클래스 하나가 여러개의 책임과 기능을 도맡고 있다면 해당 클래스는 유지보수하기가 굉장히 어려워지고, 시간이 지나면서 코드양이 많아지기 때문에 개발 가능성도 크게 떨어지게 될 것입니다.

이는 리액트에서도 마찬가지입니다. 만약 하나의 컴포넌트가 fetch부터 view까지 모든 기능을 한번에 표현하려고 하면 어떻게 될까요? 개발 당사자는 코드가 편하게 보일지 몰라도, 협업을 하는 입장에서는 해당 코드를 이해하는데 많은 시간을 들여야 할 수도 있을 것입니다.
따라서 **하나의 컴포넌트는 하나의 책임만 진다.** 라는 개념으로 SRP를 리액트 형식으로 치환하여 도입해볼 수 있습니다.

- 컴포넌트는 하나의 역할만 수행해야 합니다. 예를 들어 데이터를 가져오는 로직과 UI 렌더링 로직을 분리할 수 있습니다.

```jsx
// Presentational Component : UI 렌더링만 책임집니다.
const UserProfile = ({ user }) => (
  <div>
    <h1>{user.name}</h1>
    <p>{user.bio}</p>
  </div>
)

// Container Component : 데이터 페칭 및 관리를 책임집니다.
const UserProfileContainer = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
  }, [])

  return user ? <UserProfile user={user} /> : <p>Loading...</p>
}
```

## 개방 폐쇄 원칙(Open/Closed Principle, OCP)

OCP는 확장에는 열려있어야 하고, 수정에는 닫혀있어야 한다는 원칙입니다.
클래스에 새로운 메서드를 추가하려고 하는데 기존에 있던 메서드를 모두 변경해야 한다면 어떨까요? 개발 속도가 굉장히 늦어지고, 유지보수성도 크게 떨어질 것입니다. 어떤 에러가 날지 추적도 어렵게 될 것이고요.
이러한 일을 사전에 방지하기 위해 OCP가 있습니다. 새로운 기능을 추가하는 것에는 열려있어야 하고, 기존 코드를 수정하는 것에는 최대한 닫혀있어야 합니다.

프론트엔드에서는 어떻게 적용할 수 있을까요? 기존 컴포넌트를 수정하지 않은 상태에서 컴포넌트를 확장할 수 있을까요?
네 물론 가능합니다. 컴포넌트를 재사용 가능하게 적절히 추상화하여 설계하는 방법으로 도달할 수 있습니다.

```jsx
const Button = ({ onClick, children, style }) => (
  <button onClick={onClick} style={style}>
    {children}
  </button>
)

// 다양한 버튼으로 확장 가능
const PrimaryButton = (props) => (
  <Button {...props} style={{ backgroundColor: 'blue', color: 'white' }} />
)
```

위를 보시면 PrimaryButton 컴포넌트는 기존의 Button 컴포넌트를 수정하지 않으면서도 새로운 기능을 추가할 수 있는 가능성을 가지게 되었습니다.
이러한 방식으로 OCP를 리액트에 도입할 수 있겠습니다.

## 리스코프 치환 원칙(Liskov Substitution Principle, LSP)

LSP는 **서브 클래스는 기반 클래스의 역할을 대체할 수 있어야 한다**는 다소 이해하기 어려운 원칙입니다.
특정 클래스를 확장하여 만든 클래스거나, 그러한 클래스로 생성한 인스턴스들은 서로 교환이 가능해야 한다는 말로도 해석할 수 있는데요.

리액트에서 LSP를 적용하려면 컴포넌트 간의 대체 가능성에 초점을 맞춰야 합니다. **부모 컴포넌트가 자식 컴포넌트를 특정 props와 함께 사용할 때, 어떤 자식 컴포넌트로 바꿔도 부모 컴포넌트가 기대하는 동작이 깨지지 않도록 설계하는 것이지요.**

이를 달성하기 위해서는

- 동일한 인터페이스(props)를 사용해야 하고,
- 각 컴포넌트가 **일관된 동작**을 보장해야 합니다.

```jsx
// 부모 컴포넌트에서 Image 타입을 추상화하여 자식 컴포넌트를 교체해도 문제없도록 설계
const BaseImage = ({ src, alt }) => <img src={src} alt={alt} />
const PlaceholderImage = (props) => (
  <BaseImage src="placeholder.jpg" {...props} />
)
const ActualImage = (props) => <BaseImage {...props} />

// 부모 컴포넌트
const renderImage = (isLoading, src) => {
  const ImageComponent = isLoading ? PlaceholderImage : ActualImage

  return <ImageComponent alt="Dynamic image" src={src} />
}
```

- 위의 PlaceholderImage와 ActualImage는 같은 props를 사용하고 있습니다. 이를 통해 부모 컴포넌트는 특정 이미지 컴포넌트를 사용할 때, 굳이 다른 처리를 하지 않아도 됩니다.
- 또한 두 컴포넌트는 내부적으로는 다른 역할을 수행하더라도, 부모 컴포넌트가 기대하는 alt와 src를 사용하여 이미지를 화면에 보여주게 됩니다.
- ActualImage와 PlaceholderImage를 서로 교환하는 것도 굉장히 쉬운 작업이 됩니다.

## 인터페이스 분리 원칙 (Interface Segregation Principle, ISP)

ISP는 클래스는 사용하지 않는 인터페이스에 의존하지 않아야한다는 원칙입니다. 어떤 클래스가 사용하지도 않는 클래스와 의존하고 있다면 어떻게 될까요?
클래스를 변경할 때마다 의존되는 클래스들을 같이 고쳐줘야 할 것입니다. 아무런 사용도 하고 있지 않은데도 말입니다.

이는 리액트의 컴포넌트에서도 그대로 적용됩니다. 만약 부모 컴포넌트가 자식 컴포넌트에게 아무런 의미도 없는 props를 넘겨주면 어떻게 될까요?
부모 컴포넌트의 props 변동이 있을때마다 자식 컴포넌트는 사용하지 않는 props에 대해 코드 수정을 해줘야 할 것입니다. 이는 상당히 귀찮은 작업으로 이어지겠지요.

ISP를 리액트에 적용하려면

- 컴포넌트에 너무 많은 props를 전달하지 않도록 주의해야 합니다.
- 즉, 각 컴포넌트는 필요한 기능과 데이터만 상위 컴포넌트로부터 받아와야 합니다.

```jsx
const UserCard = ({ name, email }) => (
  <div>
    <h2>{name}</h2>
    <p>{email}</p>
  </div>
)

// user는 name, email을 비롯하여 phone, gender 등등 수많은 프로퍼티를 포함한 객체라고 가정했을 때...
// 자식 컴포넌트에 전달할 props에는 필요한 데이터만 전달
const UserCardContainer = ({ user }) => (
  <UserCard name={user.name} email={user.email} />
)
```

## 의존성 역전 원칙(Dependency Inversion Principle, DIP)

DIP는 고수준 모듈은 저수준 모듈에 의존해서는 안되며, 둘 다 추상화에 의존해야 한다는 개념으로써 살짝 진입 장벽이 있는 느낌으로 받아들여 집니다.
프론트엔드 코드 적용에 앞서, 고수준 모듈과 저수준 모듈은 무엇인지 알아보도록 합시다.

- **고수준 모듈**은 시스템이 무엇을 해야하는지 결정하는 추상적인 계층입니다. 선언적으로 사용되며, 구체적인 동작들은 저수준 모듈에 의존하는 모듈입니다.
- **저수준 모듈**은 시스템의 세부적인 동작이나 구현 방법을 처리하는 구체적인 계층입니다. 고수준 모듈에서 요청한 작업을 실제로 수행하는 모듈입니다.

이 둘이 서로 직접적으로 의존해서는 안된다가 DIP의 핵심입니다. 둘은 직접적으로 의존해서는 안되며, 추상화된 인터페이스에 의해 의존되어야 합니다.

이렇게 구성하면

- 저수준 모듈이 변경되었을 경우에도 고수준 모듈이 독립적으로 존재할 수 있게 됩니다.
- 또한 저수준 모듈을 변경하거나 대체해도 시스템의 고수준 모듈은 그대로 유지될 수 있게 됩니다.

UserService라는 모듈의 예시를 들어 DIP에 대해 알아보겠습니다.

### 1. 추상화 인터페이스 도입

```js
// 추상화된 인터페이스
export class UserService {
  getUser(userId) {
    throw new Error('getUser must be implemented')
  }
}
```

- 추상화 용도로 사용할 인터페이스입니다.
- 확장하지 않은 상태에서 그냥 사용한다면 에러를 던지게 됩니다. 즉 무언가 추가로 구현하지 않는다면 사용할 수 없는 코드입니다.
- 이로써 해당 클래스가 인터페이스 역할만 할 수 있도록 강제할 수 있습니다.

### 2. 저수준 모듈 구현

```js
import { UserService } from './UserService'

export class ApiUserService extends UserService {
  async getUser(userId) {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  }
}
```

- UserService 인터페이스를 확장하여 ApiUserService라는 저수준 모듈을 구현합니다.
- getUser라는 기능이 새롭게 정의되며, 원하는 저수준의 기능을 수행할 수 있게 됩니다.

### 3. 고수준 모듈 구현

```js
import { useEffect, useState } from 'react'

export const UserProfileContainer = ({ userId, userService }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const data = await userService.getUser(userId) // 추상화된 인터페이스 사용
      setUser(data)
    }
    fetchUser()
  }, [userId, userService])

  return user ? <UserProfile user={user} /> : <p>Loading...</p>
}
```

- 고수준 모듈은 props로 넘겨받은 UserService에 의존하되, 저수준 구현체에 직접적으로 의존하지 않습니다.

### 4. 서비스 주입

```js
import { ApiUserService } from './ApiUserService'

const userService = new ApiUserService()

export const Container = () => (
  <UserProfileContainer userId="123" userService={userService} />
)
```

- 보다 상위 컴포넌트에서 구체적으로 생성된 ApiUserService를 고수준 모듈에 주입합니다.

이를 통해

- 고수준 모듈은 UserService라는 추상화된 인터페이스에 의존하게 되며, 특정 저수준 구현체(API)에 대해 알지 못하게 됩니다.
- 저수준 모듈인 ApiUserService는 UserService를 구현한 구현체이므로, 동일한 인터페이스를 따릅니다.
- 고수준 모듈은 UserService를 상위 컴포넌트에서 주입받게 됨으로써 구현체를 직접 생성하지 않습니다. 이는 테스트나 서비스 교체에 용이한 구조가 됩니다.

고수준 모듈이 저수준 모듈을 직접적으로 사용하지 않는다는 점에서 코드의 결합도를 낮출 수 있게 됩니다.
나중에 저수준 모듈 내 세부 사항이 변경되더라도 고수준 모듈은 저수준 코드의 변경 사항을 아예 몰라도 상관 없으므로 추후 유지보수에 큰 장점을 지니게 될 수 있습니다.

## 굳이 SOLID를 적용해야 하는가?

리액트 코드에 굳이 SOLID를 적용해서 사용해야 할까요? 저는 100% 지킬 필요는 없다고 생각합니다. 대부분의 개발자들이 REST API를 100% RESTful하게 사용하지 않는 것 처럼요.
단, SOLID의 핵심적인 내용은 적절히 인지한 상태에서 코드를 개발하는 것은 좋을 것 같습니다. 결국 개발자들의 궁극적인 목표 중 하나는 유지보수가 쉬운 코드, 개발 지속성이 보장되는 코드를 짜는 것이라고 할 수 있으니까요.
100% 지키지는 못하더라도 어느정도 본인이 만든 컴포넌트가 어떠한지 생각은 한번씩 해보며 개발을 하게 된다면 결국에는 괜찮은 방향으로 흘러가지 않을까 하는 생각이 듭니다.
