---
title: '[nest.js] prisma, nest.js, supabase 연동'
description: '어색한듯 어색하지 않은 이 조합. 한번 연동해봅시다.'
thumbnail: '/images/nest.svg'
tags: [backend]
draft: false
created_date: 2024-09-20 12:29:38
---

# [nest.js] prisma, nest.js, supabase 연동

`nest.js`에 `supabase`를 연결해봅시다. **ORM**은 `prisma`를 사용할 것입니다.

## (사전준비) nest.js 프로젝트, prisma 설치

우선적으로 nest.js 프로젝트와 prisma를 준비해보겠습니다. 우선적으로 nest.js의 설치가 필요한데요. prisma와 supabase를 연동하기위해 이 게시글을 찾으신 개발자분이시라면 nest.js 설치에 대해서는 어느정도 익숙할 것이라 판단됩니다. 따라서 이 파트에서는 nest.js 프로젝트 설치가 완료되었다고 가정하고, prisma 설치 방법에 대해서만 중점적으로 다뤄보도록 하겠습니다.

먼저 nest 프로젝트가 설치된 폴더에 아래 명령어를 통해 prisma를 개발 의존성으로 설치합니다.

```bash
npm install -D prisma
# or yarn, pnpm etc...
```

prisma가 설치되었다면 `npx prisma something`를 통해 CLI를 사용하실 수 있는데요. 명령어에 대한 설명을 보시려면 터미널에 `npx prisma`를 실행해보세요.

```bash
npx prisma

# 위 명령어를 실행하시면 prisma CLI에 대한 설명이 나옵니다.
Examples
    Set up a new Prisma project
    $ prisma init

    Generate artifacts (e.g. Prisma Client)
    $ prisma generate

    Browse your data
    $ prisma studio

    Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
    $ prisma migrate dev

    Pull the schema from an existing database, updating the Prisma schema
    $ prisma db pull

    Push the Prisma schema state to the database
    $ prisma db push

    Validate your Prisma schema
    $ prisma validate

    Format your Prisma schema
    $ prisma format

    Display Prisma version info
    $ prisma version

    Display Prisma debug info
    $ prisma debug
```

자 여기서 nest.js와 prisma 셋팅은 잠시 대기입니다. 이후 과정은 supabase에서 DB 주소를 따온 후 진행해보도록 하겠습니다.

## STEP 1. supabase에서 connection string 따오기

이제 supabase를 prisma+nest.js에 연동해보려고 합니다. 먼저, supabase에서 new project를 눌러 새로운 DB를 만듭니다.

<img width="813" alt="image" src="https://github.com/user-attachments/assets/6d983f98-5394-4983-9abf-d2355810f2c9" />

- supabase 프로젝트를 만드는 과정은 생략하도록 하겠습니다.
- (**New Project** 버튼을 클릭하고 쭉 진행하시면 됩니다.)

다 만드셨다면 [Database Settings 페이지](https://supabase.com/dashboard/project/_/settings/database)에서 연결할 데이터베이스를 찾은 후 접속합니다.
아래 사진처럼 configuration 분류에 위치한 database를 클릭하시면 상단에 **대제목** **Database Settings**과, **소제목** **Connection string**이 보입니다.

<img width="1371" alt="image" src="https://github.com/user-attachments/assets/173aec62-654d-44f0-9fd9-d0ccf81a0bf5" />

여기에 명시된 DB 주소를 이용해 nest.js와 supabase를 연결할 것입니다. DB 주소는 `커넥션 풀러`와 연관이 있는데요. 커넥션 풀러에는 트랜잭션 모드와 세션 모드 2가지가 있습니다. 두 모드는 클라이언트와 DB와의 연결 유지를 어떻게 관리하느냐에 따라 약간의 차이가 있습니다. 구체적으로는 필자도 알 수 없으나, 트랜잭션 모드같은 경우에는 pgbouncer와 함께 사용하게 되면 쿼리문 사용에 약간의 호환성 에러가 발생하므로, postgres와의 호환성 문제 해결을 위해 **트랜잭션 모드의 주소 뒤에는 <br /> `?pgbouncer=true&connection_limit=1` 를 붙여주어야 합니다.** (세션 모드는 상관없습니다.)

**최종적으로 아래와 같이 DB 주소를 준비해주시면 되겠습니다.** 주소를 그대로 복붙하시고 비밀번호를 채워 넣으신 후 트랜잭션 모드의 주소 뒤에다가만 위의 문자열을 마저 이어붙여주시면 됩니다.

```bash
# transtaction connection pooler url
DATABASE_URL="postgresql://postgres.ID:PASSWORD@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# session connection pooler url
DIRECT_URL="postgresql://postgres.ID:PASSWORD@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
```

이로써 supabase에서의 세팅은 끝났습니다! 다시 nest.js로 돌아가보도록 하지요.

## STEP 2. 환경변수 및 prisma 세팅

먼저 nest.js의 프로젝트 루트 폴더에 환경변수 파일을 만들어보겠습니다. DB 주소는 노출되면 안되는 정보이므로, **.env** 파일을 통해 관리해주어야 합니다.

```bash
touch .env
```

생성된 .env 파일에 미리 만들어놓은 URL을 복붙합니다. 이로써 모든 준비는 끝났고, prisma 셋팅만이 남았습니다.

앞선 작업에서 prisma를 설치만 하고 잠시 대기했었는데요. 본격적인 연동을 위해 prisma 초기화를 진행해보겠습니다. 터미널에 아래 명령어를 입력해줍니다.

```bash
npx prisma init
```

위 명령어를 입력하면 프로젝트 내에 `prisma` 디렉터리 및 디렉터리 내부에 DB 주소와 모델 등이 명시되는 아주 중요한 파일인 `schema.prisma` 파일이 생성됩니다.
DB에 모델을 등록하기 위해 아래 코드를 `schema.prisma` 파일에 복붙해줍니다.

```ts
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

모델 Post, User가 보입니다. DB 주소와 prisma, nest.js가 제대로 연결되었는지 확인하기 위해 migration 명령어를 통해 해당 모델들을 supabase DB의 테이블로 만들어보도록 하겠습니다.

```bash
npx prisma migrate dev --name init
```

모든 것이 올바르게 작동하면 터미널에 아래 이미지와 같은 메시지가 표시됩니다.

<img width="945" alt="image" src="https://github.com/user-attachments/assets/c210cb1b-7182-49cc-9251-e627ac4b0f1e" />

## STEP 3. 연결 확인

schema.prisma와 supabase의 동기화가 완료되었다면 supabase에 정말로 Post, User 테이블이 생성되었는지 확인을 해보아야 합니다.

<img width="1429" alt="image" src="https://github.com/user-attachments/assets/27feb5b6-2b6b-4c53-9bc5-c945fefccbd3" />

관리 페이지에 접속하여 테이블란을 확인해보시면 Post, User 테이블이 생성된 것을 알 수 있습니다. 잘 연결되었습니다!

## 참고

1. https://supabase.com/partners/integrations/prisma
2. https://www.prisma.io/
