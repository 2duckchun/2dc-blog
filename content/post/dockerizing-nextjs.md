---
title: '[번역] Next.js 애플리케이션 도커라이징'
description: 'Next.js 도커라이징에 관련된 미디움 번역글입니다.'
thumbnail: '/images/docker.svg'
tags: ['frontend', 'docker']
draft: false
created_date: 2025-09-25 20:15:18
---

# Next.js 애플리케이션 도커라이징

원본 : https://kristiyanvelkov.medium.com/dockerizing-a-next-js-application-in-2025-bacdca4810fe

Next.js는 빠르게 진화하고 있으며, 2025년에도 여전히 현대적인 웹 애플리케이션을 구축하기 위한 가장 강력한 ㄹ프에임워크 중 하나입니다. 하지만 배포 단계에 들어서면 개발자들은 종종 같은 도전에 직면합니다.

> 어떻게 하면 Next.js 앱을 빠르고, 안전하며 프로덕션에 적합한 방식으로 컨테이너 할 수 있을까?

이번 글에서는 제가 운영 중인 프로덕션 Dockerfiles 저장소를 기반으로 한 실용적인 Next.js용 Docker 설정을 함께 살펴보겠습니다. 목표는 여러분이 프로젝트에 바로 적용할 수 있는 **검증된**, **최소한의** 그리고 **미래 지향적인** 구성을 제공하는 것입니다.

저는 Docker Captain이자 React, Vue, Angular 등 다양한 프레임워크를 위한 Docker 샘플의 저자입니다. 프론트엔드 개발자로써, 이번 글에서는 전문 용어가 아닌 쉽고 실용적인 언어로 단계를 하나씩 설명해 드리겠습니다.

이 포스트를 다 보시면, 당신은 빠르고 안전하게, 그리고 최적화된 도커 셋업으로 Next.js를 배포할 수 있게 되실겁니다.

## 왜 Next.js를 도커라이징할까?

코드로 바로 들어가기 전에, 먼저 중요한 질문부터 짚고 넘어가겠습니다. 왜 굳이 도커라이징을 해야 할까요? 저는 그 이유를 딱 3가지로 정리했습니다.

- 1. 일관성(Consistency) : 로컬, 스테이징, 프로덕션 환경이 모두 동일합니다. "내 컴퓨터에선 잘 되는데요?" 같은 문제가 사라집니다.
- 2. 확장성(Scalability) : 어디서든 실행 가능합니다. 로컬 환경, CSP(클라우드 제공업체), Kubernetes, Docker Swarm 모두 문제 없습니다.
- 3. 성능(Performance) : 최적화된 빌드, 줄어든 이미지 크기, 더 빠른 배포 속도를 얻을 수 있습니다.

여러분의 Next.js 프로젝트가 단순히 "내 컴퓨터에서는 잘 된다" 수준을 넘어 확장 가능한 서비스로 발전하길 원한다면, Docker는 가장 자연스러운 해답입니다.

## 프로젝트 구조

Next.js 앱의 루트 디렉토리에 Dockerfile을 두는 것이 좋습니다. 권장되는 파일 구조는 다음과 같습니다.

```bash
.
├── next.config.js
├── package.json
├── package-lock.json
├── public/
├── .dockerignore
└── Dockerfile
```

## Next.js 애플리케이션을 Dockerize하는 단계

### Step 1: Next.js 앱 생성

다음 명령어로 새로운 Next.js 애플리케이션을 생성하세요:

```bash
npx create-next-app@latest "your_app_name"
```

🔗 자세히 보기: https://nextjs.org/docs/app/getting-started/installation

### Step 2: Docker 앱 초기화

Next.js 앱이 준비되면 프로젝트 폴더로 이동한 뒤, 다음 명령으로 Docker를 초기화하세요:

```bash
docker init
```

이 명령은 `Dockerfile`,`compose.yaml`, `.dockerignore`, `README.Docker.md`와 같은 필수 Docker 구성 파일을 생성하여 애플리케이션 컨테이너화를 위한 탄탄한 시작점을 제공합니다.

완료 후, 프로젝트 디렉터리에는 다음과 같은 새 파일들이 포함됩니다:

```bash
├── "your_app_name"/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── compose.yaml
│   └── README.Docker.md
```

### Step 3: Next.jsfmf Standalone 출력으로 구성

프로덕션 최적화 및 Docker 컨테이너에서 더 쉽게 실행하기 위해, `next.config.ts` 파일에 다음 설정을 추가하세요.

```ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  output: 'standalone'
}
export default nextConfig
```

이 설정은 Next.js가 자체 포함된 빌드를 생성하도록 하여, 더 적은 의존성으로 간단하게 배포할 수 있도록 돕습니다.

🔗 자세히 보기: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output

### Step 4: Dockerfile 구성하기

프로젝트 루트의 `Dockerfile`을 열고, 아래 설정(또는 여러분의 설정)으로 내용을 교체하세요.

```Dockerfile
# ============================================
# 1단계(베이스 단계) : 경량 Node.js 이미지를 사용하세요.
# ============================================
# 공식 Node.js 알파인 모델을 사용하세요.
ARG NODE_VERSION=22.17.0-alpine
FROM node:${NODE_VERSION} AS base
# 도커 컨테이너 내부에 작업 디렉터리를 설정하세요.
WORKDIR /app
#  Docker 캐시 활용을 위해 패키지 관련 파일만 먼저 복사
COPY --link package.json package-lock.json ./
# 빌드 시 환경 변수 설정
ENV NODE_ENV=production
# npm ci를 사용해 의존성 설치 (깨끗하고 재현 가능한 설치가 보장됨)
RUN npm ci --omit=dev && npm cache clean --force

# ============================================
# 2단계(빌더 단계) : Next.js 애플리케이션 빌드
# ============================================
# 베이스 이미지를 사용해 애플리케이션 빌드
FROM base AS builder
# 애플리케이션 소스 전체를 컨테이너에 복사
COPY --link . .
# 애플리케이션을 standalone 모드로 빌드 (빌드 파일은 .next/standalone에 존재함)
RUN npm run build

# ============================================
# 3단계(이미지 생성 단계): 프로덕션 이미지 생성
# ============================================
# 최종 프로덕션 컨테이너에서도 동일한 Node.js 버전 사용
FROM node:${NODE_VERSION} AS runner
# 보안 모범 사례를 위해 내장된 비루트 사용자 사용
USER node
# Next.js standalone 서버의 포트 설정 (기본값은 3000)
ENV PORT=3000
# 런타임 시 Next.js 텔레메트리 비활성화
ENV NEXT_TELEMETRY_DISABLE=1
# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app
# 최종 이미지를 최소화하기 위해 빌더 단계에서 필요한 파일만 복사
COPY --link --from=builder /app/.next/standalone ./
COPY --link --from=builder /app/.next/static ./.next/static
COPY --link --from=builder /app/public ./public
# HTTP 트래픽 허용을 위해 3000 포트 노출
EXPOSE 3000
# standalone 서버를 사용해 애플리케이션 시작
ENTRYPOINT ["node", "server.js"]
```

**이 설정의 주요 이점**

1. 멀티 스테이지 빌드 : 프로덕션에 필요한 파일만 최종 이미지에 남게 됩니다.
2. 더 작은 이미지 : node:20-alpine 기반으로 풋프린트(하드웨어나 소프트웨어의 점유 공간)를 최소화합니다.
3. 보안 : non-root 유저로 애플리케이션을 실행합니다.
4. 빠른 설치 : 결정적 설치(deterministic installs)를 위한 npm ci를 사용합니다.

<Hint>
결정적 설치 : package-lock.json과 같은 도구를 기준으로 항상 동일한 버전과 동일한 의존성 트리를 재현할 수 있는 설치 방식

- npm install : package.json을 참고하여 의존성을 설치 (최신 버전 설치 가능성 있음)
- npm ci : package-lock.json을 그대로 신뢰하여 설치. 고정된 버전 정보를 사용하여 설치하기 때문에 동일한 결과물 보장

</Hint>

### Step 5: `.dockerignore` 파일 구성하기

.dockerignore 파일은 Docker가 이미지를 빌드할 때 제외해야 할 파일과 폴더를 지정합니다.

이를 통해 다음과 같은 효과를 얻을 수 있습니다:

- 이미지 크기 축소
- 빌드 속도 향상
- 민감하거나 불필요한 파일(예: .env, .git, node_modules)이 최종 이미지에 포함되지 않도록 방지

🔗 자세히 보기: https://docs.docker.com/reference/dockerfile/#dockerignore-file

```yaml
# 의존성과 빌드 산출물 무시
node_modules/
dist/
out/
.next/
.vercel/
.tmp/
.cache/

# Vite, Webpack, React 관련 빌드 산출물 무시
.vite/
.vitepress/
.eslintcache
.npm/
coverage/
jest/
cypress/
cypress/screenshots/
cypress/videos/
reports/

# 환경 변수 및 설정 파일 무시 (민감 데이터)
*.env*
*.log

# TypeScript 빌드 산출물 무시
*.tsbuildinfo

# 잠금 파일 무시 (패키지 설치를 Docker에서 처리한다면 선택 사항)
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 로컬 개발 관련 파일 무시
.git/
.gitignore
.vscode/
.idea/
*.swp
.DS_Store
Thumbs.db

# Docker 관련 파일 무시 (불필요한 설정 복사 방지)
Dockerfile
.dockerignore
docker-compose.yml
docker-compose.override.yml

# 빌드 관련 캐시 파일 무시
*.lock

# AI 관련 파일 및 캐시 무시
*.ai
*.aider*
*.chatgpt*
*.cursor/
__pycache__/
openai/
kiro/
anthropic/
ai_outputs/
ai_cache/
```

### Step 6: compose.yaml 구성하기

프로젝트 루트의 `docker-compose.yml` 파일을 다음 내용으로 업데이트하세요.

```yaml
services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      PORT: 3000
    ports:
      - '3000:3000'
    restart: unless-stopped
```

이 구성은 app이라는 서비스를 정의하며, 다음을 수행합니다:

- 현재 디렉터리에서 이미지를 빌드합니다(context: .).
- 도커 이미지를 host로 태깅합니다.
- 로컬 머신의 3000 포트를 컨테이너 내부의 3000 포트에 매핑합니다.
- 환경 변수 NODE_ENV를 development로 설정합니다.

이제 다음 명령으로 Docker Compose를 사용해 앱을 실행할 수 있습니다:

### Step 7: Docker Compose로 Next.js 애플리케이션 실행하기

다음 명령어로 애플리케이션을 실행하세요:

```bash
docker compose up -d --build
```

- --build 플래그 : 변경 사항이 있을 경우 이미지를 다시 빌드합니다.
- .d 플래그 : 컨테이너를 백그라운드(Detached 모드)에서 실행합니다.

컨테이너가 실행되면 브라우저를 열고 아래 주소로 이동하세요:

👉 http://localhost:3000

이제 여러분의 Next.js 애플리케이션이 Docker 내부에서 프로덕션 모드로 실행되는 것을 확인할 수 있습니다.

## 마무리

2025년에 Next.js 앱을 도커라이징하는 것은 복잡할 필요가 없습니다. 멀티 스테이지 빌드, 최소한의 베이스 이미지, 그리고 보안을 고려한 실행 방식을 통해 단 몇 줄의 설정만으로도 프로덕션 수준의 배포를 달성할 수 있습니다.

시행착오를 건너뛰고 대부분의 인기 있는 프론트엔드 프레임워크/라이브러리를 위한 즉시 사용 가능한 템플릿을 원한다면, 전체 저장소를 확인해 보세요:

👉 [원글 작성자 리포지토리](https://github.com/kristiyan-velkov/frontend-prod-dockerfiles)

- React.js — v19 ✅
- Next.js — v15 ✅
- Remix.js — v2 ✅
- Angular — v19 ✅
- Analog.js — v1 ✅
- Vue.js — v3 ✅
- Nuxt.js — v3 ✅

이러한 모범 사례를 따르면 더 빠른 배포, 더 작은 이미지, 그리고 매끄러운 확장 경험을 누릴 수 있을 것입니다.

© 2025 Kristiyan Velkov . All rights reserved.
