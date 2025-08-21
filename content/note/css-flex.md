---
title: '왜 flex item이 flex container의 넓이를 뚫어버리는가'
description: '맨날 까먹습니다.'
thumbnail: ''
tags: ['css']
draft: false
created_date: 2025-08-21 23:17:58
---

# 왜 flex item이 flex container의 넓이를 뚫어버리는가

## 1. 문제 현상

`display: flex` 컨테이너 안에서 `flex: 1`을 준 아이템이 부모 컨테이너의 너비를 넘어가 버리는 경우가 종종 있다.  
예를 들어, 사이드바와 본문 레이아웃에서 본문 영역이 오른쪽으로 밀려나며 오버플로우가 발생한다.

---

## 2. 원인: `min-width: auto`의 기본값

- **flex item의 기본 `min-width` 값은 `auto`이다.**
- `min-width: auto`일 때, 최소 너비는 **자식 컨텐츠의 본래 크기**를 기준으로 한다.
- 따라서 flex item 내부에 다음과 같은 요소가 있다면 줄어들지 못한다:
  - 긴 문자열/URL
  - 고정폭 테이블
  - 넓은 이미지

결과적으로 아이템이 flex container의 가용 너비를 뚫고 나가며, 브라우저는 스크롤이나 overflow 영역을 표시하게 된다.

---

## 3. flex 축소(shrink)가 동작하지 않는 이유

- `flex: 1`은 `flex: 1 1 0%`를 의미한다.
  - grow: 1 → 남은 공간 차지
  - shrink: 1 → 공간이 모자라면 줄어듦
  - basis: 0% → 기본 크기 0에서 시작
- 그런데 **shrink가 실제로 발동하려면 아이템이 줄어들 수 있어야 한다.**
- 하지만 `min-width: auto` 때문에 "줄어드는 하한선"이 너무 크게 잡혀 있다.  
  → 내부 컨텐츠 크기 이상으로는 절대 줄어들지 않는다.  
  → 결과: flex container보다 아이템이 넓어진다.

---

## 4. 해결 방법: `min-width: 0`

flex 아이템에 `min-width: 0`을 명시하면, 줄어들 수 있는 하한선이 0으로 바뀐다.  
그 결과:

- 아이템이 부모 flex container의 너비 안에 맞춰 줄어든다.
- 내부 컨텐츠는 잘리거나(overflow), 스크롤 처리(`overflow-x-auto`)로 대응 가능하다.

```css
.flex-item {
  flex: 1 1 0%;
  min-width: 0; /* 핵심 */
}
```

```jsx
// 테일윈드 예시
<div class="flex">
  <aside class="w-64 shrink-0">사이드바</aside>
  <main class="flex-1 min-w-0 overflow-x-auto">긴 테이블이나 콘텐츠</main>
</div>
```

## 5. 요약

- flex item이 container 너비를 뚫는 이유는 기본 min-width: auto 때문이다.
- 이는 내부 컨텐츠 크기를 줄이지 않으려는 동작에서 비롯된다.
- 따라서 flex: 1만으로는 충분하지 않고, min-w-0을 함께 적용해야 한다.
- 레이아웃에서 본문/테이블 영역에 flex-1 min-w-0을 주는 패턴이 자주 등장하는 이유가 여기에 있다.
