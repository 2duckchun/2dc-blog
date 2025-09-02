---
title: '절차지향 객체지향 (김영한님 강의)'
description: ''
thumbnail: ''
tags: []
draft: false
created_date: 2025-09-02 12:30:48
---

# 절차 지향 프로그래밍 vs 객체 지향 프로그래밍

## 절차 지향 프로그래밍

- 이름 그대로 절차를 지향. 실행 순서를 중요하게 생각함
- 프로그램의 흐름을 순차적으로 따르며 처리함.
- "어떻게"를 중심으로 프로그래밍 함

## 객체 지향 프로그래밍

- 객체를 중요하게 생각하는 방식
- 실제 세계의 사물이나 사건을 객체로 보고, 객체들 간의 상호작용을 중심으로 프로그래밍 하는 방식.
- "무엇을" 을 중심으로 프로그래밍 함

### 둘의 중요한 차이

- 절차 지향 : 데이터와 해당 데이터에 대한 처리 방식이 분리되어 있음.
- 객체 지향 : 데이터와 그 데이터들에 대한 행동(메서드)이 하나의 객체 안에 포함.

## 음악 플레이어 만들기

### 요구사항

1. 음악 플레이어를 켜고 끌 수 있어야 함
2. 음악 플레이어의 볼륨을 증가, 감소할 수 있어야 함
3. 음악 플레이어의 상태를 확인할 수 있어야 함

### 절차 지향 음악 플레이어

```java
// oop1/MusicPlayerMain1

package oop1;

public class MusicPlayerMain1 {
    public static void main(String[] args) {
        int volume = 0;
        boolean isOn = false;

        // 음악 플레이어 켜기
        isOn = true;
        System.out.println("음악 플레이어 시작");

        // 볼륨 증가
        volume++;

        // 볼륨 감소
        volume--;

        // 음악 플레이어 상태 보기
        System.out.println("음악 플레이어 상태 확인");
        if (isOn) {
            System.out.println("ON");
        } else {
            System.out.println("OFF");
        }

        // 음악 플레이어 끄기
        isOn = false;
            System.out.println("음악 플레이어 종료");
    }
}
```
