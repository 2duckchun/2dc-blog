---
title: '[JS] 열거성(Enumerable)과 직렬화(Stringify) 연구'
description: '객체의 프로퍼티가 비열거형(non-enumerable)이면 객체를 직렬화(JSON.stringify)했을 때 뭔가 뜻하는대로 동작하지 않습니다. 그런데 열거형은 뭘까요? 간단히 알아봅니다.'
thumbnail: '/images/javascript.svg'
tags: [javascript]
draft: false
created_date: 2024-10-15 22:42:17
---

# 열거성(Enumerable)과 직렬화(Stringify) 연구

연구의 시작은 **왜 에러 객체를 직렬화하면 내부에 있는 프로퍼티가 모조리 숨겨지는걸까?** 였습니다.
에러 객체에 점 표기법을 쓰면 모든 프로퍼티에 접근이 가능한데도 불구하고, 직렬화만 정상적으로 동작하지 않습니다.

<img width="325" alt="image" src="https://github.com/user-attachments/assets/d2c05e3e-54f9-4934-a1fd-bee85607096f" />

사진에서 보시다시피 객체 접근법을 사용하면 프로퍼티에 접근이 가능한데 직렬화를 하면 빈 문자열이 나옵니다. 이러면 뭔가 어긋납니다.
궁금증을 해결하기 위해 구글링을 해보았고 명확한 답은 없었습니다만 역시 정답은 공식문서에 있었습니다.

## 열거성(Enumerable)

열거성(enumerable)은 객체 프로퍼티의 속성 중 하나로, 해당 프로퍼티가 `for... in`나 `Object.keys()` 등의 메서드나 명령어로 인해 열거가 될지 되지 않을지를 결정합니다.
일반적인 방법으로 객체를 생성할 경우, `enumerable`은 `true`가 됩니다. 이는 `Object.getOwnPropertyDescriptor(객체명, 프로퍼티명)`나 `Object.getOwnPropertyDescriptors(객체명)` 메서드를 통해 확인할 수 있지요.

<img width="400" alt="image" src="https://github.com/user-attachments/assets/e4251355-e1c3-4b78-a877-4db2b38d40ec" />

별다른 조치를 취하지 않고 생성한 일반적인 객체의 enumerable은 기본적으로 `true` 입니다. enumerable이 `true`면 열거가 가능하다는 의미이지요. 따라서 반복문이나 직렬화도 잘 먹습니다.

enumerable 속성은 `Object.defineProperty(객체명, 프로퍼티명, { 옵션 })` 메서드를 이용하면 손쉽게 바꿀 수 있습니다.
위 사진에서 만든 **commonObj 객체**의 **name 프로퍼티**의 enumerable을 `false`로 바꿔보겠습니다.

<img width="445" alt="image" src="https://github.com/user-attachments/assets/67fa33b6-61a7-4bcf-8535-4886ac74955b" />

enumerable이 false인 프로퍼티는 직렬화되지 않았네요. 왜 이렇게 동작할까요? 사실 이유는 단순합니다. JSON.stringify의 설계가 그렇게 되어있기 때문입니다.

## JSON 직렬화(JSON.stringify)

다들 아시는 개념이겠지만 JSON.stringify에 대해 간단히 소개드리겠습니다. JSON.stringify는 **JSON**을 **문자열**로 만드는 메서드입니다. 브라우저나 서버에서 사용되는 자료형(Data Type)들은 사실 네트워크 상에서는 직렬화(문자열화)된 상태로 존재합니다.
JSON.stringify도 그것을 반영한 것이지요. JSON은 자바스크립트 객체 표기법(Javascript Object Notation)의 준말이고, 자바스크립트 객체는 자바스크립트 언어에서나 객체라는 데이터 타입으로 존재하기 때문입니다. (더 상세한 참고자료는 mdn 공식문서의 JSON.stringify에서 보실 수 있습니다.)

공식문서를 보시면 JSON.stringify는 enumerable이 false인 프로퍼티에 한해 직렬화하지 않는다고 명시가 되어 있습니다.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/e1e110c5-3662-4c5d-a2e0-5527c690d70d" />

> Only enumerable own properties are visited.

## 회고

오랜만의 뻘짓이었습니다만 나름대로 의미가 있었던 것 같습니다. 이 포스팅에서는 enumerable과 JSON.stringify만 다뤘지만 나중에 확장할 지식도 얻어간 듯 합니다.
공부할때는 머리가 뜨거웠는데 포스팅을 하니까 차분히 정리가 되네요. 너무 즐거운 포스팅이었습니다. 읽어주셔서 감사합니다.

## 참고

1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
2. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
