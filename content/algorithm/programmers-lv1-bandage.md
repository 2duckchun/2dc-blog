---
title: '[프로그래머스 lv.1] 붕대감기'
description: '조건이 많은 단순 구현 문제입니다.'
thumbnail: '/images/coding-test.webp'
tags: ['코딩테스트', '프로그래머스']
draft: false
created_date: 2024-11-13 00:20:05
---

# [프로그래머스 lv.1] 붕대감기

## 문제 링크

https://school.programmers.co.kr/learn/courses/30/lessons/250137

## 문제 해석

### 조건 추상화

1. 공격을 받는 턴에는 데미지를 입고, 공격을 받지 않는 턴에는 회복을 하는 시스템입니다.
2. 특정 턴을 채웠을 때 추가로 회복이 들어오는 시스템이 있습니다. 기존 체력을 넘는 초과회복은 불가능합니다.
3. 데미지를 입어 체력이 0이 되면 즉시 -1을 리턴하고 종료됩니다.
4. 모든 데미지를 입고도 살아남았다면 그 때의 체력을 리턴합니다.

## 코드

```js
function solution(bandage, health, attacks) {
  const [시전시간, 초당회복량, 추가회복량] = bandage
  let 마지막공격시간 = 0
  let 현재체력 = health
  for (const [공격시간, 피해량] of attacks) {
    const 시간차 = 공격시간 - 마지막공격시간 - 1
    const 회복량 =
      시간차 * 초당회복량 + Math.floor(시간차 / 시전시간) * 추가회복량
    현재체력 = Math.min(현재체력 + 회복량, health)
    현재체력 -= 피해량
    마지막공격시간 = 공격시간
    if (현재체력 <= 0) return -1
  }
  return 현재체력
}
```

## 풀이

이 문제의 키포인트는 체력을 회복할 시간차를 구하는 것 입니다.

- 문제의 입출력 예시에서 시간은 0부터 시작함을 알 수 있습니다. 또한 공격 받는 턴에는 회복이 불가능합니다.

- 예를 들어 첫 공격 턴이이 2턴이라면 0턴과 1턴에는 체력을 회복하고 2턴에는 체력을 회복할 수 없습니다.

- 이후 다음 공격 턴이 7턴이라면 3턴, 4턴, 5턴, 6턴까지는 체력을 회복합니다. 7턴에는 체력을 회복할 수 없습니다.

따라서 체력을 회복할 시간차는 `공격받는턴 - 이전에공격을당한턴 - 1`로 구할 수 있습니다. 이 공식만 알면 나머지는 문제에서 제시한 조건대로 쭉 풀면 되는 간단한 문제였습니다.