---
title: 'React Router 구현 및 코드 이해'
description: '블로그 글을 따라 React Router를 구현해보고 코드를 이해해보는 시간을 가져보았습니다.'
thumbnail: '/images/react.png'
tags: ['frontend']
draft: false
created_date: 2024-12-17 22:34:41
---

# React Router 구현

https://velog.io/@k-svelte-master/react-router-interview

위 블로그 글을 따라 React Router를 구현해보았습니다.

## Link 컴포넌트

```tsx
// link.tsx
import React, { ReactNode } from 'react'

type LinkProps = {
  to: string
  children: ReactNode
}

export const Link: React.FC<LinkProps> = ({ to, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()

    // URL 업데이트 및 커스텀 이벤트 디스패치
    window.history.pushState({}, '', to)
    window.dispatchEvent(new Event('pushstate'))
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  )
}
```

리액트는 SPA(Single Page Application) 라이브러리입니다. 따라서 리액트 앱에서는 내부적으로 URL을 변경할 때 페이지 새로고침이 발생하면 안됩니다. 하지만 기본적으로 a태그를 클릭하면 브라우저의 기본 동작으로 인해 새로고침이 일어납니다.

이를 막기 위해 a태그의 onClick 이벤트를 조작하여 기본 이벤트를 막아야 합니다.
(`e.preventDefault()` 사용)

또한, URL은 실제로 변경된 것 처럼 보여야 하므로 History API의 pushState 메서드를 사용합니다.
pushState는 다음과 같은 3개의 인자를 받습니다.

1. `state`: 추가적인 데이터를 저장할 수 있는 상태 객체입니다.
2. `title`: 브라우저에서 보통 무시되는 문자열입니다. 일반적으로 빈 문자열을 할당합니다.
3. `url`: 변경될 URL입니다.

pushState를 사용하면 URL이 변경되지만 페이지가 새로고침되지 않아 SPA의 목적을 달성할 수 있습니다.

하지만 리액트가 History API의 pushState 동작을 감지하지 못한다는 문제점이 있습니다. 리액트가 어떤 식으로든 URL이 변경된 것을 감지해야만 페이지를 변경해줄 수가 있는데요.
이 문제는 별도의 커스텀 이벤트를 발생시켜 해결할 수 있습니다. 위의 코드에서는 `pushstate`라는 이벤트를 강제로 일으켜서 리액트가 클라이언트 사이드에서 이벤트를 감지할 수 있게끔 했습니다.

(호출된 이벤트를 처리하도록 지시하는 메서드인 dispatchEvent에 대한 정보는 아래 링크를 확인해주세요.)
https://ko.javascript.info/dispatch-events

## Route 컴포넌트

```tsx
import { ComponentType } from 'react'

export type RouteProps = {
  path: string
  component: ComponentType<any>
}

export const Route: React.FC<RouteProps> = ({ component: Component }) => {
  return <Component />
}
```

Route 컴포넌트는 특정 path와 해당 경로에 매칭되는 컴포넌트를 렌더링하는 역할을 하는 간단한 컴포넌트입니다. 코드를 보면 놀라울 정도로 간단하네요. path에 해당하는 컴포넌트를 받아서 그대로 리턴합니다.

## Router 컴포넌트

```tsx
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { RouteProps } from './route'

export type RouterProps = {
  children: ReactNode
}

export const Router: React.FC<RouterProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  )

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('pushstate', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('pushstate', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const routes = React.Children.toArray(children) as ReactElement<RouteProps>[]

  const activeRoute = routes.find((child) => child.props.path === currentPath)

  return activeRoute ? React.cloneElement(activeRoute) : null
}
```

Router 컴포넌트는 현재 URL 경로에 맞는 컴포넌트를 렌더링하는 역할을 합니다. 이벤트 리스너를 통해 경로 변화를 감지하고, 해당 경로에 맞는 Route 컴포넌트를 반환합니다.

- `pushstate`: Link 컴포넌트 클릭 시 발생하는 커스텀 이벤트
- `popstate`: 브라우저의 뒤로 가기/앞으로 가기 버튼 클릭 시 발생하는 기본 이벤트

이 이벤트들이 발생하면 handleLocationChange가 호출되어 currentPath 상태가 업데이트 됩니다.
Router는 Route 컴포넌트들을 children으로 받아 배열로 관리하며, currentPath와 일치하는 Route를 찾아 렌더링합니다. 일치하는 경로가 있으면 React.cloneElement를 사용해 컴포넌트를 복제하고 화면에 렌더링합니다.

## App 적용

```tsx
import './App.css'
import { Link } from './router/link'
import { Router } from './router/router'
import { Route } from './router/route'

const Home: React.FC = () => {
  return <h1>Home Page</h1>
}

const About: React.FC = () => {
  return <h1>About Page</h1>
}

function App() {
  return (
    <>
      <nav>
        <Link to="/home">Home</Link> | <Link to="/about">About</Link>
      </nav>

      <Router>
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
      </Router>
    </>
  )
}

export default App
```

<img width="931" alt="image" src="https://github.com/user-attachments/assets/74829be6-ca84-440a-97d7-fc6cf62f9f24" />

위의 코드를 적용하면 React Router 라이브러리를 사용하는 것 처럼 잘 동작합니다. 100% 동일한 코드는 아니겠지만, 원 글을 작성해주신 분 말씀대로 내부적으로는 이렇게 동작하겠다라는 것을 확실히 깨우치게 되었습니다.

## 공부하며 얻어갈 수 있었던 코드들

이번 학습을 통해 다양한 기능과 개념을 다루면서 실무에서 활용할 수 있는 코드와 원리를 정리해 보았습니다.

### 커스텀 이벤트

커스텀 이벤트를 사용한다는 것은 브라우저의 DOM을 직접 다루는 것을 의미합니다. 일반적으로 React와 같은 선언적 라이브러리에서는 이런 접근은 최대한 지양해야 하지만, 필요할때는 불가피하게 사용할 수 있을 것 같습니다.
만약 사용해야 한다면 아래처럼 별도의 hook으로 만들어서 보다 리액트스럽게 사용할 수 있지 않을까요?

```tsx
import { useEffect } from 'react'

const useCustomEvent = (eventName: string, callback: () => void) => {
  useEffect(() => {
    window.addEventListener(eventName, callback)
    return () => window.removeEventListener(eventName, callback)
  }, [eventName, callback])
}
```

### pushState(\{state\})

window.history.pushState는 브라우저 히스토리 스택에 새로운 항목을 추가하는 메서드입니다. 첫 번째 인자로 받는 상태 객체는 `popstate` 이벤트가 발생했을 때 꺼내 쓸 수 있습니다.

```tsx
window.history.pushState({ page: 1 }, '', '/page1')

window.onpopstate = (event) => {
  console.log(event.state) // { page: 1 }
}
```

솔직히 자주 사용할 일은 없어 보이지만, 복잡한 상태 관리가 필요할 때 알고 있으면 유용하게 사용할 수 있을 것 같습니다.

### React의 Children 배열과 cloneElement

Children 배열은 꽤 흥미로웠습니다. 리액트는 기본적으로 데이터가 부모에서 자식으로 흐르는 구조를 가지지만, Children 배열을 활용하면 마치 부모가 자식의 데이터를 받아보고 제어할 수 있는 수단이 생긴다고 느꼈습니다.
특히 cloneElement를 사용하면 기존 컴포넌트를 복제하면서 새로운 props를 추가하거나 수정할 수 있다는 점이 인상적이었습니다. 적절히 활용하면 최적화에 꽤 요긴하게 쓸 수 있을 것 같습니다.

```tsx
const Parent = ({ children }: { children: React.ReactNode }) => {
  return React.Children.map(children, (child) =>
    React.cloneElement(child as React.ReactElement, {
      additionalProp: 'Props 덮어쓰기'
    })
  )
}

const Child = ({ additionalProp }: { additionalProp: string }) => {
  return <div>{additionalProp}</div>
}

const App = () => (
  <Parent>
    <Child additionalProp={'기존 Props'} />
  </Parent>
)

export default App
```

잘만 사용하면 부모 컴포넌트가 자식을 더 유연하게 제어하면서도 리액트의 흐름을 유지할 수 있는 도구가 되어줄 것 같습니다.
