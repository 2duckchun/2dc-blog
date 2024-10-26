---
title: '[자료구조] 이진 탐색 트리(Binary Search Tree) 구현 with 타입스크립트'
description: '이진 탐색 트리를 구현해봅니다.'
thumbnail: '/images/bst.png'
tags: [data-structure, CS]
draft: false
created_date: 2024-10-23 10:45:20
---

# 이진 탐색 트리 (Binary Search Tree)

<strong>트리 구조는 그래프의 일종으로, 한 노드(root)에서 시작하여 다른 노드들을 순회하며 자기 자신에게 돌아오는 순환이 없는 연결 그래프를 말합니다.</strong>
그 구조가 나무를 뽑아 거꾸로 세워놓은 것 같이 생겼기에 트리 구조라고 부르지요. 이 트리 구조는 정말 다양한 구현에 사용됩니다. 웹 개발자라면 반드시 알아야 하는 DOM도 트리 구조를 띄고 있습니다. 운영체제의 디렉터리들도 트리 구조를 띄고 있고요. 참 중요도가 높은 자료구조입니다.

트리 자료구조는 중요도에 걸맞게 다양한 종류가 있습니다. 이번 게시글에서는 트리 중 가장 기본이 되는 이진 탐색 트리에 대해 알아보고 구현하는 시간을 가져보겠습니다.

## 이진 탐색 트리 규칙

- 부모 노드는 최대 2개의 자식노드를 가집니다.
- 왼쪽 노드는 부모보다 항상 작은 값을 가집니다.
- 오른쪽 노드는 부모보다 항상 큰 값을 가집니다.

이진 탐색 트리는 부모의 왼쪽은 항상 작고, 오른쪽은 항상 크다는 규칙에 의해 특정 값을 찾을 때마다 탐색 범위를 절반씩 버려가며 효율적으로 연산을 할 수 있는 자료구조입니다.
덕분에 이진 탐색 트리에서 특정 값을 삽입하거나 찾는 데에는 평균적으로 O(logN)의 시간 복잡도가 걸립니다. 이는 매우 효율적인 시간 복잡도입니다. 1024개의 노드가 있다고 가정했을 때 10번만 탐색하면 원하는 값을 찾을 수 있기 때문이지요.

<img width="684" alt="image" src="https://github.com/user-attachments/assets/34098e7e-0c10-4330-a62f-0fd52311b1bc" />

이진 탐색 트리는 위 사진처럼 탐색해야 할 노드의 절반씩을 버려가며 찾을 수 있다는 특성 덕분에 O(logN)이라는 훌륭한 시간복잡도를 가지지만, <b>부모 노드의 왼쪽은 무조건 작아야하고 오른쪽은 무조건 커야한다는 조건 때문에 좋지 않은 탐색 시간이 걸릴 때도 있습니다.</b> 아래 사진처럼 값이 큰 값에서부터 작은 값 순으로 줄줄이 나열된다면 마치 연결리스트와 다를 바 없게 됩니다.

<img width="517" alt="image" src="https://github.com/user-attachments/assets/8c09b645-ea35-474c-83f5-27400c1cd04b" />

## 이진 탐색 트리 명세

자 그럼 이진 탐색 트리를 구현해보기 위한 명세를 먼저 작성해보도록 하겠습니다.

<Description title="이진 탐색 트리 명세">

1. 노드 클래스 생성 <strong>(class NodeItem)</strong>

   - value, left, right 프로퍼티로 구성된다.
   - value는 대소를 비교할 수 있는 데이터 타입이어야 한다.
   - left, right는 동일한 노드 클래스로 만들어진 인스턴스가 할당된다.

2. BST 클래스 <strong>(class BST)</strong>

   - root 프로퍼티로 구성된다.
   - root에는 노드 인스턴스가 할당된다.

3. 노드 추가 <strong>(insert(value))</strong>

   - 새로운 값을 이용해 노드를 생성한다.
   - 초기화 상태의 트리라면 root에 새롭게 만든 노드를 할당하고 메서드를 종료한다.
   - root에 값이 존재한다면 currentNode를 root로 한 후 반복문을 통해 값을 비교하며 순회한다.
   - 새로 추가한 노드의 값이 currentNode 노드보다 작으면 왼쪽을 탐색한다.
   - 새로 추가한 노드의 값이 currentNode 노드보다 크면 오른쪽을 탐색한다.
   - 반복하여 값을 비교하며, 적절한 위치(left, right)에 값을 추가하고 메서드를 종료한다.

4. 노드 탐색 <strong>(find(value))</strong>

   - 현재 root가 비어있는지 체크하고, 비어있다면 undefined를 반환하여 탐색을 끝낸다.
   - 비어져 있지 않다면 value와 노드들을 이진 탐색 논리에 맞게 비교하며 값을 탐색한다.
   - 탐색중인 노드의 value가 value 파라미터와 같을 경우, 해당 노드를 반환한다.
   - 탐색중인 노드의 value가 value 파라미터보다 작을 경우, left를 탐색한다.
   - 탐색중인 노드의 value가 value 파라미터보다 클 경우, right를 탐색한다.
   - 탐색 중 다음 노드가 null이라면 undefined를 반환한다.

</Description>

### 구현

```ts
class NodeItem<T> {
  value: T
  left: NodeItem<T> | null
  right: NodeItem<T> | null
  constructor(value: T) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BST<T> {
  root: NodeItem<T> | null
  constructor() {
    this.root = null
  }

  insert(value: T): this | undefined {
    let newNode = new NodeItem(value)
    if (this.root === null) {
      this.root = newNode
      return this
    }
    let cntNode = this.root
    while (cntNode) {
      if (cntNode.value === newNode.value) {
        return undefined // 동일한 값이 이미 있다면 undefined 출력으로 삽입 종료
      }

      // 왼쪽 트리 탐색 후 값 추가
      if (value < cntNode.value) {
        if (cntNode.left === null) {
          cntNode.left = newNode
          return this
        }
        cntNode = cntNode.left
      } else if (value > cntNode.value) {
        // 오른쪽 트리 탐색 후 값 추가
        if (cntNode.right === null) {
          cntNode.right = newNode
          return this
        }
        cntNode = cntNode.right
      }
    }
  }

  find(value: T): NodeItem<T> | undefined {
    let cntNode = this.root
    while (cntNode) {
      if (value === cntNode.value) {
        return cntNode // 일치하는 값을 찾으면 반환
      }
      if (value < cntNode.value) {
        cntNode = cntNode.left
      } else {
        cntNode = cntNode.right
      }
    }
    return undefined // 값이 없으면 undefined 반환
  }
}
```

## 후기

모든 트리 구조의 기초 뼈대 지식이 되는 이진 탐색 트리를 구현해보았습니다. 다음 시간에는 이를 토대로 한 Heap 트리에 대해 구현해보겠습니다. 흠.. 그리고 자료구조 구현에 타입스크립트를 굳이 추가하여 러닝 커브를 올려야할지에 대해서는 잘 모르겠네요. 다음 게시글부터는 자바스크립트로만 포스팅해볼까 합니다.

## 참고

1. https://ko.wikipedia.org/wiki/%ED%8A%B8%EB%A6%AC_%EA%B5%AC%EC%A1%B0
