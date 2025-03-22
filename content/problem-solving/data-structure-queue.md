---
title: '[자료구조] 큐의 추상 자료형 및 자료구조 구현 with 타입스크립트'
description: '가장 기초적인 자료구조인 큐를 공부했습니다.'
thumbnail: '/images/knou.svg'
tags: [data-structure, CS, KNOU]
draft: false
created_date: 2024-10-14 11:57:41
---

# 큐(Queue)의 추상 자료형

큐는 자료구조의 기본적인 형태로써 **현실 세계의 대기열을 추상적으로 구현해놓은 자료구조** 입니다. 사람들이 백화점에 줄을 서는 개념이라고 생각하면 좋은데요. 이러한 특성을 통해 운영체제의 작업 스케쥴러를 만든다던가, 대기열을 관리한다던가 하는 기능을 구현할 수 있습니다.

구현할 큐의 기본적인 연산은 아래와 같습니다.

- 큐를 생성하는 연산 (create)
- 큐가 가득 찼는지 체크하는 연산 (isFull)
- 큐에 자료를 추가하는 연산 (enqueue)
- 큐가 비었는지 체크하는 연산 (isEmpty)
- 큐에 가장 먼저 추가된 원소를 출력하는 연산 (dequeue)

이를 추상자료형으로 정리해보겠습니다

<Description title="ADT Queue(큐 추상 자료형)">
- 큐 객체 : 0개 이상의 원소를 갖는 유한 순서 리스트
- 연산 : queue ∈ Queue, item ∈ element, maxQueueSize ∈ positive integer인 모든 queue, item, maxQueueSize에 대하여 다음과 같은 연산이 정의된다(queue는 0개 이상의 원소를 갖는 큐, item은 큐에 삽입되는 원소, maxQueueSize는 큐의 최대 크기를 정의하는 정수).

1. Queue Create_q(maxQueueSize) ::= 큐의 크기가 maxQueueSize인 빈 큐를 생성하고 반환한다.
2. Boolean QueueIsFull(queue, maxQueueSize) ::= <br />
   if ((queue의 element 개수 == maxQueueSize)) <br />
   then \{ true 반환 }<br />
   else \{ false 반환}<br />
3. Queue Enqueue(queue, item) ::= <br />
   if (QueueIsFull(queue))
   then \{ queueFull을 출력 } <br />
   else \{ 큐의 rear 방향에 item 삽입 후 큐 반환 } <br />
4. Boolean QueueIsEmpty(stack) ::= <br />
   if (!QueueIsFull(queue))
   then \{ true 반환 }<br />
   else \{ false 반환 }<br />
5. Element Dequeue(Queue) ::= <br />
   if (QueueIsEmpty(queue))
   then \{ queueEmpty 출력 }<br />
   else \{ 큐의 front 방향에 위치한 원소를 삭제하고 반환 }<br />

End Queue
</Description>

위의 추상 자료형에 따라 큐는 자연스레 FIFO(First In First Out: 처음에 삽입된 원소가 가장 먼저 나감) 형태를 띄게 됩니다.

큐에서 가장 중요한 개념은 **item의 추가는 rear(뒤쪽) 방향에서 일어나고 item의 삭제는 front(앞쪽) 방향에서 일어난다는 것** 입니다. 이를 명확히 인지하셔야 구현할 때 멀리 돌아가지 않으실 수(?) 있습니다.

## 큐 구현 (타입스크립트)

아래 코드는 추상 자료형 명세를 따라 큐를 타입스크립트로 구현한 것입니다.

```ts
// 추상자료형을 추상클래스로 표현해보았습니다.
abstract class AbstactDataTypeQueue {
  protected maxSize: number
  protected size: number = 0
  constructor(maxSize: number) {
    this.maxSize = maxSize
  }
}

// 큐에 삽입될 노드를 표현한 클래스입니다.
class NodeItem<T> {
  data: T
  next: NodeItem<T> | null = null
  constructor(data: T) {
    this.data = data
  }
}

// 큐 자료구조입니다. 타입을 제네릭으로 하여 타입 안정성을 높여보았습니다.
class Queue<T> extends AbstactDataTypeQueue {
  front: NodeItem<T> | null = null
  rear: NodeItem<T> | null = null
  constructor(maxSize: number) {
    super(maxSize)
  }

  // 큐가 꽉 찼을 경우 체크
  queueIsFull(): boolean {
    return this.size === this.maxSize
  }

  // rear에 새로운 노드를 추가
  enqueue(data: T): Queue<T> {
    const node = new NodeItem(data)
    if (this.queueIsFull()) throw new Error('Queue Is Full!')
    if (this.rear === null) {
      this.front = node
    } else {
      this.rear.next = node
    }
    this.rear = node
    this.size++
    return this
  }

  // 큐가 비어있을 경우 체크
  queueIsEmpty(): boolean {
    return this.size === 0 // 큐가 비어있는지 확인
  }

  // front에 있는 노드 제거
  dequeue(): NodeItem<T> | null {
    if (this.queueIsEmpty()) throw new Error('Queue Is Empty!')
    const dequeuedNode = this.front // 노드를 꺼냄
    this.front = this.front?.next || null // front를 다음 노드로 이동
    if (this.front === null) {
      // queue가 비었을 때 front, rear null 설정
      this.rear = null
    }

    this.size--
    return dequeuedNode
  }
}
```

### 정리

큐 자료구조는 그 특성상 기본적인 대기열을 관리하는 것에 특화되어 있지만, 워낙 기본적인 형태이므로 다양한 자료구조 및 알고리즘에 널리 활용됩니다.

## 참고

1. 자료구조(한국방송통신대학교 교재) - 강태원, 정광식 저
