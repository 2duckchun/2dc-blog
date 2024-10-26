---
title: '[자료구조] 연결 리스트 구현 with 타입스크립트'
description: '연결 리스트를 구현해봅니다.'
thumbnail: '/images/knou.svg'
tags: [data-structure, CS, KNOU]
draft: false
created_date: 2024-10-22 18:39:00
---

# 연결 리스트

<b>연결 리스트는 나열된 데이터를 효과적으로 이용하기 위해 구현된 자료구조입니다.</b> 얼핏 들으면 배열과 비슷해 보이기도 하고, 자바스크립트 관점에서 따졌을떄도 배열과 연결 리스트에는 큰 차이가 없어보입니다. 배열이라고 하면 같은 데이터 타입을 가진 엘리먼트들을 메모리 상에 일렬로 나열해야 하지만 자바스크립트에서 다루는 배열은 그렇지 않기 때문입니다. (자바스크립트는 애초에 배열 자체를 유사 배열 객체로써 다룹니다.) 그럼에도 불구하고 CS 측면에서 배열과 연결 리스트는 분명히 다른 자료구조입니다.

메모리 관점에서 따져봅시다. 그림으로 한번 보겠습니다.

- <img width="672" alt="image" src="https://github.com/user-attachments/assets/a1e082d8-28c4-4e89-b2b8-a15372baaf66" />

위 네모 격자(...)를 메모리 셀로 가정해봅시다. <u>배열은 동일한 데이터 타입(그림에서는 int)의 엘리먼트를 물리적인 메모리에 순차적으로 적재해놓은 모습을 띕니다.</u>
int형 배열의 경우에는 하나의 인덱스 당 4byte로 구성되어 있고, 기준점(0번 인덱스)에서 얼마만큼 떨어져 있느냐로 배열 내 엘리먼트를 추적합니다.
<b>위 사진에서 인덱스3을 찾기 위해서는 0번 인덱스의 시작 주소 0x00에서 4byte \* 3 만큼 떨어진 메모리 주소를 참조해야 합니다.</b> 즉 메모리 주소 0x12에서 0x16까지가 인덱스3의 범위가 됩니다.

반면에 연결 리스트는 반드시 메모리에 순차적으로 적재되어 있지 않습니다. 따라서 인덱스를 통해 값을 찾는 것이 불가능 합니다. 대신 포인터로 서로 연결되어 있기 때문에 포인터를 하나씩 따라가다보면 연결된 노드들을 하나씩 탐색할 수 있습니다.

- <img width="672" alt="image" src="https://github.com/user-attachments/assets/0fbcc8be-dd1a-4fd6-ae61-d4bae035c0de" />

이러한 구조적 특성 탓에 배열과 연결 리스트는 약간의 차이가 존재합니다.

## 배열과 연결 리스트의 차이

- <b>배열</b>은 인덱스를 통해 메모리 주소를 참조하여 원하는 값을 빠르게 찾을 수 있습니다. (상수 복잡도 O(1)로 찾을 수 있습니다.)
- <b>배열</b>의 중간에 위치한 엘리먼트를 삭제하거나 다른 엘리먼트를 추가할 경우, 해당 인덱스 뒤에 있는 요소들이 모두 당겨져오거나, 밀리게 되는 등의 연산이 추가로 걸립니다. (선형 복잡도 O(n)가 생깁니다.)
- <b>연결 리스트</b>는 엘리먼트를 바로 참조할 수 있는 별도의 인덱스가 없으므로, 탐색에 선형 복잡도(O(n))가 걸립니다.
- <b>연결 리스트</b>는 리스트 내 엘리먼트의 삭제 또는 추가 작업이 용이합니다. 탐색에 걸리는 시간을 제외하면 엘리먼트의 삭제나 추가를 상수 복잡도(O(1))로 해결할 수 있습니다.

즉 배열은 인덱스를 이용한 참조가 발생할 때 탁월한 성능을 자랑하며 연결 리스트는 리스트 내 엘리먼트를 삭제하거나 추가하는 것에 장점이 있습니다.
두 자료구조의 공통점은 추후 이를 통해 다른 자료구조(스택, 트리, 힙, 그래프 등) 를 사용하는데 쓰인다는 것 입니다.

## 연결 리스트 명세

구현을 해보기에 앞서, 연결 리스트의 명세를 간단하게 작성해봅시다.

<Description title="단일 연결 리스트 명세">

1. 노드 클래스 생성 <strong>(class NodeItem)</strong>

   - value, next 프로퍼티로 구성된다.
   - next는 다음 노드를 찾기 위한 포인터로 사용된다.

2. 연결 리스트 생성 <strong>(class LinkedList)</strong>

   - 연결 리스트를 생성한다.
   - 리스트의 참조를 유지할 head와 tail을 프로퍼티를 만든다.
   - 현재 연결 리스트의 길이를 알 수 있게 length 프로퍼티를 만든다. (선택)

3. 노드 탐색 <strong>(searchNode(data))</strong>

   - 특정 값을 가진 노드를 탐색한다. (순회)
   - 시작 노드를 head 프로퍼티로 둔다.
   - 시작 노드부터 반복문을 통해 순회하며 일치하는 값을 찾아 출력한다.
   - 일치하는 값이 없다면 null을 출력한다.

4. 노드 추가 <strong>(insertNode(data))</strong>

   - 새로운 값을 이용해 노드를 생성한다.
   - 초기화 상태인 연결리스트라면 head와 tail을 해당 노드로 설정하고 메서드를 종료한다.
   - tail 노드의 next 포인터 값을 새로 생성한 노드로 설정한다.
   - tail의 참조 노드를 새로 만든 노드로 설정한다.

5. 특정 노드 뒤에 노드 추가 <strong>(insertNodeAfter(existingData, newData))</strong>

   - 새로운 값을 이용해 노드를 생성한다.
   - 앞서 만든 노드 탐색 메서드를 통해 특정 노드를 찾는다.
   - 새로 생성한 next 포인터 값을 탐색한 노드의 next로 설정한다.
   - 탐색한 노드의 next 포인터 값을 새로 생성한 노드로 설정한다.

6. 노드 삭제(head 방향) <strong>(deleteNode())</strong>

   - deleteNode 임시 변수를 만든 후 현재 head 노드를 할당해둔다.
   - head 참조를 현재 head 노드의 next 포인터로 옮긴다.
   - deleteNode 임시 변수에 담긴 노드의 next 포인터를 null로 설정한다. (연결 리스트와의 연결을 끊는다.)
   - 연결을 끊어낸 deleteNode 노드를 리턴한다.

7. 특정 노드 뒤의 노드 삭제 <strong>(deleteNodeAfter(existingData))</strong>

   - 앞서 만든 노드 탐색 메서드를 통해 특정 노드를 찾는다.
   - 특정 노드가 없을 경우 null을 반환한다.
   - 특정 노드가 있다면 해당 노드의 next 포인터를 삭제할 노드(nodeToDelete)로 지정한다.
   - 특정 노드의 next 포인터를 삭제할 노드의 next 포인터로 할당한다.
   - 삭제될 노드의 참조를 끊고, 반환한다.

</Description>

### 구현

위 명세를 이용해 타입스크립트로 연결 리스트를 구현해봅시다.

```ts
// 노드 생성 클래스
class NodeItem<T> {
  data: T
  next: NodeItem<T> | null
  constructor(data: T) {
    this.data = data
    this.next = null
  }
}

// 연결 리스트 생성 클래스
class LinkedList<T> {
  head: NodeItem<T> | null
  tail: NodeItem<T> | null
  length: number
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  // 노드 추가 (tail 방향)
  insertNode(data: T): NodeItem<T> {
    const newNode = new NodeItem(data)
    if (this.tail === null) {
      this.head = newNode
      this.tail = newNode // tail이 null일 때도 head와 함께 tail도 설정
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
    this.length++
    return newNode
  }

  // 노드 탐색
  searchNode(data: T): NodeItem<T> | null {
    let cntNode = this.head
    while (cntNode) {
      if (cntNode.data === data) {
        return cntNode // data를 찾으면 cntNode 리턴
      }
      cntNode = cntNode.next
    }
    return null // 찾지 못하고 순회가 끝나면 null 리턴
  }

  // 특정 노드 뒤에 새로운 노드 삽입
  insertNodeAfter(existingData: T, newData: T): NodeItem<T> | null {
    const existingNode = this.searchNode(existingData) // 노드 탐색 메서드 활용
    if (existingNode === null) return null // 탐색된 노드가 없다면 null 반환

    const newNode = new NodeItem(newData) // 새로운 노드 생성
    newNode.next = existingNode.next // 새 노드의 next를 기존에 존재하는 노드의 next로 할당
    existingNode.next = newNode // 기존 노드의 next를 새 노드로 할당
    this.length++
    return newNode
  }

  // 노드 삭제 (head 방향)
  deleteNode(): NodeItem<T> | null {
    if (this.head === null) return null // 빈 리스트라면 null 반환
    const nodeToDelete = this.head
    this.head = this.head.next // head 포인터 변경
    if (this.head === null) {
      // 노드를 모두 삭제한 후 tail도 null로 설정
      this.tail = null
    }
    nodeToDelete.next = null // 삭제될 노드의 참조를 끊어줌
    this.length--
    return nodeToDelete
  }

  // 특정 노드 뒤에 노드 삭제
  deleteNodeAfter(existingData: T): NodeItem<T> | null {
    const existingNode = this.searchNode(existingData) // 기존 노드 탐색
    if (existingNode === null || existingNode.next === null) return null // 기존 노드가 없거나, 노드의 다음 노드가 없다면 null 반환

    const nodeToDelete = existingNode.next // 기존 노드의 next 노드를 삭제할 노드로 지정
    existingNode.next = nodeToDelete.next // 기존 노드의 next에 삭제할 노드의 next 할당

    if (nodeToDelete === this.tail) {
      // 삭제될 노드가 tail이라면
      this.tail = existingNode // tail을 existingNode로 변경
    }
    nodeToDelete.next = null // 삭제될 노드의 참조를 끊어줌
    this.length--
    return nodeToDelete
  }
}
```

## 후기

책에 나온 내용을 단순히 구현하는 것인데도 정말 큰 공부가 되고 있습니다. 자바스크립트가 자료구조에 찰떡인 언어가 아니라는 점이 좀 아쉽긴 하지만 이렇게라도 구현하며 배워놓고 나중에 써먹어야겠습니다.

## 참고

1. 자료구조(한국방송통신대학교 교재) - 강태원, 정광식 저
