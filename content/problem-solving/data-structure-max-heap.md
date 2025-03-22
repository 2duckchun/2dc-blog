---
title: '[자료구조] 이진 힙(Binary Heap) 구현 with 자바스크립트'
description: '트리의 파생 형태 중 하나인 힙(Heap)을 구현해봅니다.'
thumbnail: '/images/max-heap.png'
tags: [data-structure, CS]
draft: false
created_date: 2024-10-25 21:55:17
---

# 이진 힙(Binary Heap)

<b>이진 힙</b>은 트리의 한 종류로써 최댓값 또는 최솟값을 추출하는데 탁월한 성능을 가진 자료구조입니다. 트리 내 최댓값, 최솟값을 효율적으로 추출할 수 있다는 자료구조의 특징 덕분에 보통 이진 힙은 우선순위 큐(Priority Queue)를 구현하기 위해 많이 사용됩니다.

## 이진 힙 특징

이진 힙은 구조상 이진 탐색 트리와 거의 동일합니다. 이진 탐색 트리는 부모 노드를 기준으로 왼쪽 자식 노드는 부모 노드보다 작아야하고 오른쪽 자식 노드는 부모 노드보다 커야한다는 제약조건이 존재했지요.

<img width="684" alt="image" src="https://github.com/user-attachments/assets/34098e7e-0c10-4330-a62f-0fd52311b1bc" />

이진 힙도 거의 비슷합니다. 부모 노드 아래에 왼쪽 자식 노드와 오른쪽 자식 노드가 있습니다. 단 이진 힙에서는 최대 이진 힙의 경우 두 자식 노드가 무조건 부모보다 작아야합니다. 반대로 최소 이진 힙의 경우에는 두 자식 노드가 무조건 부모보다 커야하지요. 그리고 부모 노드는 자식의 위계는 전혀 신경쓰지 않습니다. 그림으로 표현하면 아래와 같습니다.

<img width="671" alt="image" src="https://github.com/user-attachments/assets/586f50e2-05ee-4b1e-bb26-fa7638860457" />

<b>자식 노드의 위계를 신경쓰지 않는다는 특성 덕분에 이진 힙은 언제나 최적의 구조만을 지니게 됩니다.</b> 새롭게 추가한 값이 노드에서 가장 큰 값이라면 맨 위로 그 값을 올리면서 트리를 재정렬 하는 과정을 거치기 때문입니다.

999라는 힙 트리 내에서 가장 큰 값이 힙 트리에 새로 추가되었다고 가정해보겠습니다.

<img width="670" alt="image" src="https://github.com/user-attachments/assets/c08cf13d-6cd9-4451-93f8-c94c35fcfcb5" />

이제 999 트리는 부모 노드와 자신의 값을 비교하며 제 자리를 찾아가게 됩니다.

<img width="609" alt="image" src="https://github.com/user-attachments/assets/10d07d01-7168-4484-b528-3b018e31c8bd" />

이와 같은 특성 덕에 이진 힙은 언제나 최적의 구조를 띄게 됩니다. 이진 탐색 트리와는 근본적으로 다른 부분이라고 할 수 있죠. 따라서 언제나 최적의 시간복잡도인 log(N)을 유지할 수 있다는 장점이 있습니다.

이진 힙의 특징은 아래와 같이 정리할 수 있습니다.

- 최대 이진 힙의 루트 노드에는 트리 내에서 가장 큰 값을 가진 노드가 위치해야 한다.
- 최소 이진 힙의 루트 노드에는 트리에서 가장 작은 값을 가진 노드가 위치해야 한다.
- 부모 노드 입장에서는 자식이 자기보다 큰지 작은지만 판단하므로 자식간 크기 비교는 의미 없다.

### 이진 힙의 수학적 특징: 배열화

이진 힙은 기본적으로 트리 형태로 구성되어 있지만, <b>언제나 최적의 구조를 갖는다는 특징 덕분에 각 자식 노드의 위치를 수학적으로 정의할 수 있습니다.</b> 이해를 돕기 위해 위에서 작성한 트리를 배열로 구성해보겠습니다.

<img width="640" alt="image" src="https://github.com/user-attachments/assets/319596e8-d0fa-4213-87a5-9710c32dc8e9" />

각 노드들은 언제나 2개의 자식 노드를 가지고, 힙의 구조는 언제나 최적의 형태로 구성됩니다. 이를 배열로 치환하면 위 사진과 같은데요.

- 0번 인덱스의 좌, 우측 자식 노드는 1번 인덱스, 2번 인덱스입니다.
- 1번 인덱스의 좌, 우측 자식 노드는 3번 인덱스, 4번 인덱스입니다.
- 2번 인덱스의 좌, 우측 자식 노드는 5번 인덱스, 6번 인덱스입니다.
- ...
- <b>n번 인덱스의 좌, 우측 자식 노드는 (2n+1)번 인덱스, (2n+2)번 인덱스라는 사실을 귀납적으로 유추할 수 있습니다.</b>

<img width="357" alt="image" src="https://github.com/user-attachments/assets/c0ed48ba-929f-4231-8857-0c0b90e6ab08" />

또한 자식 노드의 인덱스를 알면 부모 노드의 인덱스도 알 수 있습니다.

<img width="424" alt="image" src="https://github.com/user-attachments/assets/e33da8af-9bcc-4f5c-aab2-434f4aa53ce2" />

```js
let parentIndex =
  Math.floor(leftChildIndex - 1) || Math.ceil(rightChildIndex - 2)
```

인덱스는 정수로 이루어져 있고 왼쪽 노드와 오른쪽 노드의 부모 노드는 같으므로, 두 공식 모두 유효합니다. 원하는 것을 사용하시면 됩니다. 이 게시글에서는 `Math.floor(leftChildIndex - 1)` 공식을 사용하겠습니다.

이러한 특성을 이용하여 이진 힙은 보통 배열로 구성을 하게 됩니다. 수학적으로 인덱스에 바로 접근하여 노드 값을 변경할 수 있기 때문입니다.

## 이진 힙 명세

자잘한 실수의 반복을 막기 위해서 구현 전 명세 작성은 필수인 것 같습니다. 이번에는 최대 이진 힙을 기준으로 명세를 작성해보겠습니다.

<Description title="단일 연결 리스트 명세">

1. 최대 이진 힙 클래스 생성 <strong>(class MaxBinaryHeap)</strong>

   - 최대 이진 힙 인스턴스를 생성한다.
   - 이진 힙은 배열로 구성될 것이므로, 배열 프로퍼티 하나를 생성한다.

2. 데이터 추가 메서드

   - 주어진 값(노드)을 배열에 push한다.
   - 추가된 노드의 부모 인덱스를 `Math.floor((n - 1) / 2)` 로 찾아 대소를 비교한다.
   - 추가된 값이 부모보다 크다면 두 노드의 위치를 교환한다.
   - 현재 비교중인 노드가 부모보다 작을때까지 해당 로직을 반복한다.

3. 데이터 제거 메서드

   - 배열의 마지막 인덱스 노드와 0번째 인덱스 노드를 서로 교환한다.
   - 배열의 가장 큰 값이 마지막 인덱스 노드가 된다. (해당 값을 배열에서 pop한 후 나중에 값으로 리턴한다.)
   - 0번째 인덱스에는 가장 작은 값이 온다. 이 값을 힙의 규칙에 맞는 원래 자리로 보내는 것이 해당 메서드의 역할이다.
   - 0번째 왼쪽 자식 인덱스 노드와 오른쪽 자식 인덱스 노드를 비교한다.
   - 왼쪽 자식 인덱스 노드가 오른쪽 자식 인덱스 노드보다 클 경우, 왼쪽 인덱스와 위치를 교환한다.
   - 반대라면 오른쪽 인덱스와 위치를 교환한다.
   - 교환된 인덱스를 현재 탐색 인덱스로 두고 부모 노드가 자식 노드보다 클 때까지 반복한다.
   - 초기에 pop했던 해당 힙의 최댓값을 리턴한다.

</Description>

### 구현

```js
class MaxBinaryHeap {
  constructor() {
    this.heap = []
  }

  insert(value) {
    this.heap.push(value)
    this._bubbleUp()
    return this.heap
  }

  _bubbleUp() {
    let cntIdx = this.heap.length - 1
    let pntIdx = Math.floor((cntIdx - 1) / 2)
    while (this.heap[cntIdx] > this.heap[pntIdx]) {
      let temp = this.heap[cntIdx]
      this.heap[cntIdx] = this.heap[pntIdx]
      this.heap[pntIdx] = temp
      cntIdx = pntIdx
      pntIdx = Math.floor((cntIdx - 1) / 2)
    }
  }

  extractMax() {
    if (this.heap.length === 0) return undefined
    if (this.heap.length === 1) return this.heap.pop()
    const max = this.heap[0]
    const last = this.heap.pop()
    this.heap[0] = last
    this._sinkDown()
    return max
  }

  _sinkDown() {
    const totalLength = this.heap.length
    let cntIdx = 0
    while (true) {
      let leftIdx = 2 * cntIdx + 1
      let rightIdx = 2 * cntIdx + 2
      let swapIdx = cntIdx

      if (leftIdx < totalLength && this.heap[leftIdx] > this.heap[swapIdx]) {
        swapIdx = leftIdx
      }

      if (rightIdx < totalLength && this.heap[rightIdx] > this.heap[swapIdx]) {
        swapIdx = rightIdx
      }

      if (swapIdx === cntIdx) return
      else {
        const temp = this.heap[swapIdx]
        this.heap[swapIdx] = this.heap[cntIdx]
        this.heap[cntIdx] = temp
        cntIdx = swapIdx
      }
    }
  }
}
```

## 후기

옛날엔 단순히 외우려고만 해서 금방 잊어버렸었는데, 이번에는 명세를 작성하고 하나 하나 구현해봄으로써 기억에 오래 남을 것 같습니다. 꾸준히 자료구조와 알고리즘 공부를 해야겠습니다.

## 참고

1. https://kayuse88.github.io/binary-heap/
