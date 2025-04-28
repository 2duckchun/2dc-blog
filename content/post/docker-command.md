---
title: '[Docker] 기본적인 Docker 개념 및 명령어 정리'
description: '기본적인 Docker의 개념과 명령어를 정리해보는 시간을 가졌습니다.'
thumbnail: '/images/docker.svg'
tags: [Docker]
draft: false
created_date: 2025-04-19 23:43:10
---

# 기본적인 Docker 개념 및 명령어 정리

> 기본적인 Docker의 개념과 명령어를 정리해보는 시간을 가졌습니다.

지난 4월 1일, 인프런에서 만우절 이벤트로 양질의 강의를 천원에 뿌렸던 일이 있었는데요. 우연히도 수강하고 싶었던 JSCode님의 Docker 강의가 이벤트 대상으로 올라와 있었습니다.

아니 살수가 없지요. 부가가치세 100원까지 해서 1,100원에 강의를 구매했습니다.
그리고 단순 이벤트로 묵혀두지 않기 위해 매일 점심시간마다 짬짬이 강의를 들으며 Docker에 대한 이해도를 넓혀가고 있습니다.

오늘은 지금까지 익힌 자주 사용하는 Docker 명령어를 정리하는 시간을 가져보려 합니다.

## Docker의 개념

Docker는 **컨테이너 기반의 가상화 기술을 제공**하는 플랫폼입니다. 복잡한 환경 설정 없이 애플리케이션을 빠르게 배포하고 실행할 수 있도록 돕습니다.

## 용어 정리

### 호스트(HOST)

Docker 엔진이 설치되어 있는 물리 서버나 가상 머신을 의미합니다.

### 이미지(IMAGE)

컨테이너를 실행하기 위한 파일 시스템과 설정값 등을 포함하고 있는 패키지입니다.

### 컨테이너(CONTAINER)

이미지를 기반으로 실행된 독립된 환경입니다. 컨테이너는 애플리케이션과 그 실행환경을 모두 포함합니다.

<img width="531" alt="image" src="https://github.com/user-attachments/assets/b2267a34-3640-4e39-b01b-390deb4236e8" />

## 자주 사용하는 명령어

### docker pull

```bash
docker pull [이미지명:태그명]
```

Docker Hub 등 외부 저장소에서 이미지를 다운로드합니다. 필요한 버전(tag)을 지정할 수도 있습니다.

### docker image ls

```bash
docker image ls
```

로컬에 다운로드된 이미지 목록을 확인하는 명령어입니다.

### docker run

```bash
docker run [이미지명:태그명]
```

기본적으로는 포그라운드(foreground) 모드로 컨테이너를 실행합니다.

백그라운드(background)로 실행하려면

```bash
docker run -d [이미지명:태그명]
```

포트 매핑 및 이름 지정까지 하려면:

```bash
docker run -d -p [호스트포트]:[컨테이너포트] --name [컨테이너명] [이미지명:태그명]
```

- `-d`: detached 모드(백그라운드 실행)

- `-p`: 포트 매핑

- `--name`: 컨테이너 이름 지정

- `-p` 플래그를 이용해 컴퓨터의 포트번호와 도커 내부의 포트번호를 연결시켜줄 수 있습니다.
- `-n`을 이용하면 컨테이너명도 지정해줄 수 있습니다.

### docker ps

```bash
docker ps
```

현재 실행 중인 컨테이너 목록을 확인합니다.

모든 컨테이너(중지 포함)를 확인하려면:

```bash
docker ps -a
```

### docker rm

```bash
docker rm [컨테이너ID 또는 이름]
```

중지된 컨테이너를 삭제합니다.

강제 삭제하려면:

```bash
docker rm -f [컨테이너ID 또는 이름]
```

### docker image rm

```bash
docker image rm [이미지ID 또는 이름]
```

이미지를 삭제합니다.

강제 삭제하려면:

```bash
docker image rm -f [이미지ID 또는 이름]
```

### docker exec -it

```bash
docker exec -it [컨테이너ID 또는 이름] bash
```

실행 중인 컨테이너 내부로 들어가 bash 쉘을 사용할 수 있습니다.

나올 때는 `exit` 명령어를 입력합니다.

### docker logs

```bash
docker logs [컨테이너ID 또는 이름]
```

특정 컨테이너의 로그를 확인할 수 있습니다.
