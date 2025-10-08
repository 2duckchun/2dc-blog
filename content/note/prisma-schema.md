---
title: 'prisma schema와 generator 흐름 정리 (Prisma 5.x 기준)'
description: '그냥 정리하고 싶은 prisma 관련 정보들 정리'
thumbnail: ''
tags: ['prisma', 'backend']
draft: false
created_date: 2025-10-08 08:34:19
---

# prisma schema와 generator 흐름 정리 (Prisma 5.x 기준)

## schema.prisma가 뭔가요?

Prisma의 Single Source of Truth 파일이다. 이 파일에는 다음과 같은 것들이 선언된다.

- datasource: 어떤 DB에 연결할 것인가? (프로바이더, URL)
- generator: 어떤 클라이언트를 생성할 것인가?
- model: 테이블 구조 (컬럼, 타입, 관계 등)

```
// prisma/schema.prisma
generator client {
  provider = "prisma-client"      // ← Prisma 5.x 기준. 최신 ESM 클라이언트 생성
  output   = "../generated/prisma" // ← 생성된 코드의 출력 위치를 명시적으로 지정
}

datasource db {
  provider = "postgresql"            // ← 어떤 DB 드라이버로 연결할지
  url      = env("DATABASE_URL")     // ← 실제 접속 주소는 .env에서 읽어옵니다.
}

model TestItem {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  title     String
  note      String?
  qty       Int      @default(0)
}
```

### 연결의 흐름

1. prisma CLI 명령어 실행

   ```
   pnpx prisma generate
   pnpx prisma db push
   pnpx prisma migrate dev
   pnpx prisma studio
   pnpx prisma validate
   pnpx prisma format
   ```

2. prisma가 `schema.prisma`를 읽음

3. datasource.url에서 `.env`의 `DATASOURCE_URL` 값을 로드

4. 그 주소로 DB에 실제 연결

5. model 정의와 DB 실제 구조를 비교/생성하거나 클라이언트 코드(`generated/prisma`) 생성

## @prisma/client는 뭔가요?

Prisma 5부터는 `@prisma/client` 대신 직접 지정한 output 경로(../generated/prisma)에 생성된 타입 안전한 데이터베이스 클라이언트 코드를 사용한다.

즉, 이 코드는 `schema.prisma`의 구조를 타입스크립트 코드로 옮긴 자동 생성 결과물이다.

내부 동작은 다음과 같다.

1. `schema.prisma`에 모델 선언

```
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
}
```

2. `pnpx prisma generate` 명령을 실행하면 prisma가 이 구조를 읽고,타입스크립트로 변환한 클라이언트를
   `generated/prisma` 폴더에 생성

3. 이후 코드에서 아래와 같이 `User` 테이블을 타입 안전하게 다룰 수 있다.

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: { email: 'test@example.com', name: '홍길동' }
  })
  console.log(user)
}

main()
```

    - prisma.user는 schema.prisma의 model User를 기반으로 만들어진 타입 안전한 API임

따라서 스키마를 바꾸면 반드시 `prisma generate`를 다시 실행해야 새 필드/모델이 코드에서 인식된다.
