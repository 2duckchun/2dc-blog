---
title: '[프로그래머스 lv.2] 타겟 넘버'
description: 'DFS, BFS 맛보기가 가능한 문제입니다.'
thumbnail: '/images/coding-test.webp'
tags: ['PS', '프로그래머스']
draft: false
created_date: 2024-11-13 00:34:39
---

# [프로그래머스 lv.2] 타겟 넘버

## 문제 링크

https://school.programmers.co.kr/learn/courses/30/lessons/43165

## 문제 해석

### 조건 추상화

1. 배열과 타겟 넘버가 주어집니다.
2. 배열의 각 요소에 덧셈, 뺄셈을 수행하면서 모든 요소를 순회했을 때 타겟 넘버가 나와야 하는 경우의 수를 찾아야 합니다.
3. 가능한 모든 조합을 탐색하는 문제입니다. 따라서 <strong>모든 경우의 수를 고려한 완전 탐색(DFS, BFS) 방식</strong>으로 접근해야 합니다.

## 코드(넓이우선탐색, BFS)

```js
function solution(numbers, target) {
  // BFS
  let count = 0
  const queue = [{ index: 0, sum: 0 }]
  while (queue.length > 0) {
    const { index, sum } = queue.pop()
    if (index === numbers.length) {
      if (sum === target) {
        count++
      }
    } else {
      queue.push({ index: index + 1, sum: sum + numbers[index] })
      queue.push({ index: index + 1, sum: sum - numbers[index] })
    }
  }
  return count
}
```

## 코드(깊이우선탐색, DFS)

```js
function solution(numbers, target) {
  // DFS
  let count = 0
  const dfs = (index, sum) => {
    if (index === numbers.length) {
      if (sum === target) {
        count++
      }
    } else {
      dfs(index + 1, sum + numbers[index])
      dfs(index + 1, sum - numbers[index])
    }
  }
  dfs(0, 0)
  return count
}
```

## 풀이

해당 문제가 DFS, BFS를 이용한 완전탐색이 필요한 문제인지 알아채리는게 관건입니다.

- <b>배열 내 주어지는 엘리먼트나 타겟 넘버가 어떤 수학적인 구조를 띄고있지 않습니다. 여기서 수학 공식을 도입하기란 거의 불가능합니다.</b>
- 즉, 무식한 방식으로 주어진 배열을 순회하면서 엘리먼트에 덧셈 뺄셈 연산을 수행하며 타겟 넘버를 만들어봐야 합니다.
- 이런 상황에서 가장 알맞은 완전 탐색 방법은 DFS, BFS입니다.

또한 해당 문제에서는 깊이우선탐색이나 너비우선탐색이 거의 동일한 복잡도로 동작합니다. 선형 배열의 경우의 수를 구하는 것이므로 사실상 둘의 차이는 콜스택을 쓰냐, 큐(메모리)를 쓰냐의 차이입니다.
