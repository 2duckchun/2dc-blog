---
title: '[프로그래머스 lv.3] 네트워크'
description: 'DFS, BFS로 해결 가능한 문제입니다.'
thumbnail: '/images/coding-test.webp'
tags: ['PS', '프로그래머스']
draft: false
created_date: 2024-11-23 23:19:28
---

# [프로그래머스 lv.3] 네트워크

## 문제 링크

https://school.programmers.co.kr/learn/courses/30/lessons/43162

## 문제 해석

그래프 노드간 연결된 무방향 엣지가 몇 개인지 파악하는 문제입니다. 단 연결되지 않은 노드는 그 자체로 엣지로 둡니다.

### 조건 추상화

- 매개변수

  - 컴퓨터 개수 `n`
  - 연결에 대한 정보가 담긴 2차원 배열 `computers`

- 제약조건
  - 컴퓨터의 갯수는 1 이상 200 이하
  - 2차원 배열 내 각 컴퓨터는 0부터 n-1인 정수로 표현됨 (전형적인 배열로 표현됨)
  - computers[i][i]는 항상 1이다. (연결되지 않은 노드는 그 자체로 엣지)

## 코드(깊이우선탐색, DFS)

```js
function solution(n, computers) {
  // 정답 변수
  let answer = 0

  // 방문 체크 배열
  const visited = new Array(n).fill(false)

  // 컴퓨터가 있는 1차 배열 순회
  for (let comIdx = 0; comIdx < computers.length; comIdx++) {
    if (!visited[comIdx]) {
      // 방문하지 않은 컴퓨터에 한해 DFS 시작
      DFS(comIdx, visited, computers)
      answer++
    }
  }

  return answer
}

function DFS(comIdx, visited, computers) {
  // 방문한 컴퓨터는 바로 방문 처리
  visited[comIdx] = true

  // 컴퓨터의 네트워크 검사
  for (let netIdx = 0; netIdx < computers.length; netIdx++) {
    // 현재 방문한 컴퓨터와 netIdx에 위치한 컴퓨터가 연결되어 있고 &&
    // 해당 netIdx에 위치한 컴퓨터를 방문하지 않았을 경우
    // 해당 netIdx를 방문할 컴퓨터로 두고 DFS 시작
    if (computers[comIdx][netIdx] && !visited[netIdx]) {
      DFS(netIdx, visited, computers)
    }
  }
}
```

## 코드(넓이우선탐색, BFS)

```js
function solution(n, computers) {
  // 정답 변수
  let answer = 0

  // 방문 체크 배열
  const visited = new Array(n).fill(false)

  // 컴퓨터가 있는 1차 배열 순회
  for (let comIdx = 0; comIdx < computers.length; comIdx++) {
    if (!visited[comIdx]) {
      // 방문하지 않은 컴퓨터에 한해 BFS 시작
      BFS(comIdx, visited, computers)
      answer++
    }
  }

  return answer
}

function BFS(start, visited, computers) {
  // 깊이우선탐색을 시작할 인덱스를 큐에 추가
  const queue = [start]
  // 탐색이 시작되었으므로 탐색에 true 표시
  visited[start] = true

  while (queue.length > 0) {
    const comIdx = queue.shift()

    for (let netIdx = 0; netIdx < computers.length; netIdx++) {
      // 방문되지 않은 노드이면서 컴퓨터간 네트워크 연결이 있다면 queue push
      if (!visited[netIdx] && computers[comIdx][netIdx]) {
        queue.push(netIdx)
        visited[netIdx] = true
      }
    }
  }
}
```

## 풀이

<img width="701" alt="image" src="https://github.com/user-attachments/assets/b0e04bde-349a-4ad2-9926-37baa7e68db0" />

그래프 탐색의 기본적인 특성을 활용하는 문제입니다. 컴퓨터들은 그래프의 `노드`에 해당하고, 네트워크 연결은 그래프의 `간선`에 해당합니다.

문제의 본질은 간선으로 연결된 노드 집합의 갯수를 판단하는 것이며, 따라서 해당 문제는 노드 집합의 갯수를 구하기 위해 `완전 탐색`을 시행해야 합니다.
