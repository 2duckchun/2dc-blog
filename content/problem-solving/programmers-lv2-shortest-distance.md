---
title: '[프로그래머스 lv.2] 게임 맵 최단거리'
description: '완전탐색 문제로 BFS를 써야 시간초과가 나지 않습니다.'
thumbnail: '/images/programmers.jpg'
tags: ['PS', '프로그래머스']
draft: false
created_date: 2024-11-25 21:04:45
---

# [프로그래머스 lv.2] 게임 맵 최단거리

## 문제 링크

https://school.programmers.co.kr/learn/courses/30/lessons/1844

## 문제 추상화

m x n 행렬 A가 있을 때, 행렬 A(0, 0)에서 행렬 A(m, n)까지 이동하는 최단 경로를 구하는 문제입니다. 행렬 내 원소는 0과 1로 표시되며, 1일 경우에만 경로로써 활용할 수 있습니다. 완전 탐색에 관련된 문제이므로 효율성을 따지지 않는다면 DFS, BFS 모두 도입할 수 있겠으나, 해당 문제는 시간 효율성을 중시하는 문제이므로 BFS를 도입하여 문제를 해결해야 합니다.

### 매개변수 및 제약조건

- 매개변수

  - 지도 `maps`
  - m x n 크기의 배열로 주어지며, 배열 내부는 1과 0값으로만 되어 있음.

- 제약조건
  - 2차원 배열 좌표 값은 1과 0만 표현함.
  - 1은 길이 열려있음을, 0은 길이 닫혀있음을 의미함.
  - m x n 위치에 상대 팀 진영(종료조건)이 있음.

## BFS를 사용해야 하는 이유

DFS와 BFS 모두 완전탐색 알고리즘으로 문제의 모든 경로를 탐색할 수 있습니다. 다만 두 알고리즘은 아래와 같은 차이점이 있습니다.

1. 탐색 방식

   - BFS는 시작점에서 가까운 경로부터 차례로 탐색합니다. 먼저 도달한 경로가 최단거리가 되므로 목표지점에 도달하면 더 이상 탐색하지 않을 수 있습니다.
   - 반면 DFS는 한 경로를 끝까지 탐색한 후 다음 경로를 탐색하므로 모든 경우의 수를 파악하고 난 후에야 최단 경로를 알 수 있습니다.

2. 시간 복잡도

   - BFS는 모든 경로를 한번씩만 방문하므로 시간 효율이 더 좋습니다.
   - DFS는 불필요하게 같은 경우를 탐색할 수 있어 조건이 큰 문제에서는 비효율적일 수 있습니다.

3. 실용성

   - BFS는 탐색 도중 목표 지점에 도달하면 탐색을 중단할 수 있습니다. 이는 추가적인 탐색을 줄일 수 있어 굉장히 실용적입니다.

## 코드(넓이우선탐색, BFS)

```js
function solution(maps) {
  // BFS에 사용할 큐
  const queue = [[0, 0, 1]]

  // 상하좌우를 탐색하는 좌표
  const coord = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
  ]

  // 방문 체크 배열
  const visited = Array.from({ length: maps.length }, () =>
    new Array(maps[0].length).fill(false)
  )

  // 배열에 안전하게 접근할 수 있도록 체킹하는 함수
  const isValidCoord = (x, y) => {
    return x >= 0 && x < maps.length && y >= 0 && y < maps[0].length
  }

  // BFS
  while (queue.length > 0) {
    const [x, y, trace] = queue.shift()

    // 방문처리를 해야 중복 방문 현상이 생겨나지 않음
    visited[x][y] = true

    // 종료조건(최단거리)
    if (x === maps.length - 1 && y === maps[0].length - 1) {
      return trace
    }

    // x, y를 기준으로 동서남북으로 이동할 수 있는 위치를 구하고 탐색 지속
    for (const [cx, cy] of coord) {
      const nx = x + cx
      const ny = y + cy
      if (isValidCoord(nx, ny) && maps[nx][ny] === 1 && !visited[nx][ny]) {
        // 방문 처리를 한 후 큐에 추가해야 중복 방문 현상이 생겨나지 않음
        visited[nx][ny] = true
        queue.push([nx, ny, trace + 1])
      }
    }
  }

  // BFS가 종료되었는데도 최단거리를 구하지 못했을 경우에는 애초에 A(m, n)에 도달할 수 없는 문제임
  return -1
}
```
