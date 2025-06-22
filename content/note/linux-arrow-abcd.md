---
title: 'vi 사용시 방향키 눌렀을때 ABCD가 입력되는 현상 해결'
description: '리눅스 입력이 맘같이 되지 않을 때 해결하는 방법2'
thumbnail: ''
tags: ['linux']
draft: false
created_date: 2025-06-22 23:35:56
---

# vi 사용 시 방향키를 누르면 ABCD가 입력되는 현상 해결

## 문제

`vi` 환경에서 방향키를 눌렀을 때 커서가 이동하지 않고, 방향키에 해당하는 문자인 `A`, `B`, `C`, `D`가 입력되는 현상이 발생함.

## 원인

이는 `vi` 또는 `vim`이 **호환 모드 (vi-compatible mode)** 로 실행되었기 때문에 발생한다.  
호환 모드에서는 **화살표 키, 백스페이스 등 특수 키 입력이 정상적으로 해석되지 않으며**, 대신 해당 키의 ANSI 시퀀스 일부가 문자로 입력된다.

예를 들어:

- ↑ : `ESC [ A` → `A`만 입력됨
- ↓ : `B`
- → : `C`
- ← : `D`

## 해결

### 방법 1: `.exrc` 또는 `.vimrc` 설정 파일을 통해 비호환 모드(nocompatible)로 설정

`.exrc` 또는 `.vimrc`는 `vi/vim`의 설정 파일이다.  
일반적으로는 `~/.vimrc` 사용을 권장하지만, `~/.exrc`도 작동한다.

#### `.exrc`를 사용할 경우

```bash
vi ~/.exrc
```

```bash
# ./exrc
set nocp      # not compatible — vim의 비호환 모드 활성화
set bs=2      # 백스페이스 키가 insert 모드에서도 정상 작동하도록 설정
```

또는

```bash
vi ~/.vimrc
```

```bash
# .vimrc
set nocompatible                 # vim의 기본 기능을 제대로 사용하기 위해 호환 모드 해제
set backspace=indent,eol,start  # 백스페이스 키가 줄 바꿈, 들여쓰기 등에서도 작동하도록 설정
```
