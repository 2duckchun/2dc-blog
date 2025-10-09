---
title: 'Bare Specifier와 Path Specifier'
description: 'Bare Specifier와 Path Specifier에 대해 간단히 정리해봅니다.'
thumbnail: ''
tags: ['node.js']
draft: false
created_date: 2025-10-09 17:58:23
---

# Bare Specifier와 Path Specifier

무심코 쓰는 import.

```js
import { something } from 'react' // Bare Specifier
import { something } from './utils/helper.js' // Path Specifier
```

간단한 import 문이지만 최근에 무의식적으로 사용하다 호되게 당한 기억이 있어서 정리한다.

---

## Bare Specifier

Bare Specifier는 `./`나 `../` 같은 경로 표시 없이 모듈 이름만 쓰는 방식이다.  
이건 Node.js나 브라우저가 “이건 로컬 파일이 아니라 패키지 이름이구나” 하고 인식한다.
그래서 `node_modules` 폴더를 뒤져서 해당 이름의 패키지를 찾는다.

```js
import { useState } from 'react'
import express from 'express'
```

이런 식으로 쓰면, 런타임은 `node_modules/react`, `node_modules/express`에서 모듈을 찾아온다.  
브라우저는 기본적으로 이런 방식을 이해하지 못해서, import map을 써서 이름을 URL로 매핑해줘야 한다.

---

## Path Specifier

Path Specifier는 이름 그대로 경로를 직접 적는 방식이다.  
`./`, `../`, `/` 같은 걸로 시작한다.  
즉, 패키지가 아니라 실제 파일 시스템 경로를 기반으로 모듈을 가져온다.

```js
import { formatDate } from './utils/date.js'
import { logger } from '../core/logger.js'
```

이 경우 Node.js는 파일 경로 그대로 탐색한다.  
ESM 환경에서는 이런 식으로 로컬 파일을 불러올 때 반드시 `.js` 확장자를 붙여야 한다.  
안 그러면 Node가 해당 모듈을 못 찾는다.

---

## 정리

| 구분          | Bare Specifier                             | Path Specifier              |
| ------------- | ------------------------------------------ | --------------------------- |
| 시작 형태     | `'react'`, `'express'`, `'@prisma/client'` | `'./foo.js'`, `'../bar.js'` |
| 찾는 대상     | `node_modules`의 패키지                    | 실제 파일 경로              |
| 브라우저 지원 | import map 필요                            | 바로 가능                   |
| Node.js       | 패키지 import                              | 로컬 파일 import            |

---

## 마무리

결국 차이는 간단하다.
패키지를 가져오면 **Bare Specifier**,  
내 프로젝트 안의 파일을 가져오면 **Path Specifier**.

이 구분만 명확히 알고 있으면,  
ESM 환경에서 import 에러로 스트레스 받을 일은 거의 없다.
