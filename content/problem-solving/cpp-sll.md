---
title: '단일 연결 리스트 구현'
description: 'C++로 단일 연결 리스트를 구현해봅니다.'
thumbnail: '/icons/c++.svg'
tags: ['C++', 'data-structure']
draft: true
created_date: 2025-04-02 23:31:36
---

# 단일 연결 리스트 구현

그냥 C++에 대한 로망 때문에 책보며 하나 하나 구현해본 SLL 자료구조이다.
언어에 대한 이해도가 없었어서 구현하기가 쉽지 않았다.

연산자 오버로딩, 이터레이터 구현, 숨겨진 컴파일러 기능 등등... 알아야 할 것들이 좀 많은 것 같다.
하지만 너무 스트레스 받지 말자. 이건 그냥 낭만때문에 하는 거니깐...

```cpp
#include <iostream>

struct singly_ll_node // 단일 연결 리스트 구조체 선언
{
    int data; // 정수 데이터
    singly_ll_node* next; // 구조체 포인터
};

class singly_ll // sll 자료구조 선언
{
public:
    using node = singly_ll_node; // 이름 간소화
    using node_ptr = node*; // 이름 간소화

    void push_front(int val) // sll 자료구조의 헤더 부분에 새로운 값을 추가
    {
        auto new_node = new node{ val, NULL }; // 새 노드 생성
        if (head != NULL) // head가 이미 있을 경우
            new_node->next = head; // 새 노드의 next 포인터를 head로 함
        head = new_node; // 새 노드로 헤드를 변경함
    }

    void pop_front() // head를 sll에서 떼어내는 메서드
    {
        auto first = head; // head를 가져온다. 노드일 수도, NULL값일 수도 있다.
        if (head) // head가 노드라면
        {
            head = head->next; // head를 head의 next로 둔다.
            delete first; // first를 메모리에서 지운다
        }
    }

    struct singly_ll_iterator // begin, end, get 등 반복자 구현을 위한 구조체 선언 (단순 타입처럼 사용한다.)
    {
    private:
        node_ptr ptr; // sll의 포인터를 private로 가진다.
    public:
        singly_ll_iterator(node_ptr p) : ptr(p) {} // 생성자이다.

        int& operator*() { return ptr->data; } // *을 오버라이딩 한다. *연산을 사용하면 데이터를 가져온다.

        node_ptr get() { return ptr; } // 현재 포인터 위치를 가져온다.

        singly_ll_iterator& operator++() // 선행증가
        {
            ptr = ptr->next; // sll의 포인터를 1 증가시킨 후
            return *this; // 값을 반환한다.
        }

        singly_ll_iterator operator++(int) // 후행증가.
        {
            singly_ll_iterator result = *this; // 현 sll의 값을 저장한 후,
            ++(*this); // sll의 포인터를 1 증가시킨다.
            return result; // 저장했던 포인터를 반환한다.
        }

        friend bool operator==(const singly_ll_iterator& left, // 동등 비교 연산자 오버라이딩
            const singly_ll_iterator& right)
        {
            return left.ptr == right.ptr; // 같은 포인터인지 비교
        }

        friend bool operator!=(const singly_ll_iterator& left, // 부정 비교 연산자 오버라이딩
            const singly_ll_iterator& right)
        {
            return left.ptr != right.ptr; // 다른 포인터인지 비교
        }
    };

    singly_ll_iterator begin() { return singly_ll_iterator(head); } // 이터레이터 용도로 사용된다.
    singly_ll_iterator end() { return singly_ll_iterator(NULL); } // 이터레이터 용도로 사용된다.
    singly_ll_iterator begin() const { return singly_ll_iterator(head); } // 이터레이터 용도로 사용된다.
    singly_ll_iterator end() const { return singly_ll_iterator(NULL); } // 이터레이터 용도로 사용된다.

    singly_ll() = default; // 기본 sll 생성자
    singly_ll(const singly_ll& other) : head(NULL) // sll 복사 생성자
    {
        if (other.head)
        {
            head = new node{ 0, NULL };
            auto cur = head;
            auto it = other.begin();
            while (true)
            {
                cur->data = *it;
                auto tmp = it;
                ++tmp;
                if (tmp == other.end())
                    break;
                cur->next = new node{ 0, NULL };
                cur = cur->next;
                it = tmp;
            }
        } // 미리 만들어진 sll을 다른 변수에 할당할 때 사용한다.
    }

    singly_ll(const std::initializer_list<int>& ilist) : head(NULL)
    // singly_ll sll = { 1, 2, 3 }; 와 같이 인스턴스를 생성할 때 컴파일러가 자동으로 호출해준다.
    {
        for (auto it = std::rbegin(ilist); it != std::rend(ilist); it++)
            push_front(*it); // 3, 2, 1 순서대로 push가 되어야 하므로, reverse begin, reverse end를 활용한다.
    }
private:
    node_ptr head; // sll의 기본값.
};

int main()
{
    singly_ll sll = { 1, 2, 3 };
    sll.push_front(0);

    std::cout << "첫 번째 리스트\n";
    for (auto i : sll)
        std::cout << i << " ";
    std::cout << std::endl;

    singly_ll sll2 = sll;
    sll2.push_front(-1);
    std::cout << "첫 번째 리스트 복사 후 맨 앞에 -1 추가\n";
    for (auto i : sll2)
        std::cout << i << " ";
    std::cout << std::endl;
    std::cout << "깊은 복사 후 첫 번쨰 리스트\n";

    for (auto i : sll)
        std::cout << i << " ";
    std::cout << std::endl;

    auto dat = sll.begin();
    std::cout << dat.get()->data;
    dat++;
    std::cout << dat.get()->data;
}
```

좋았어 가보는거야
