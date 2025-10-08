---
title: '[번역] OAuth 2 Simplified'
description: 'OAuth 2 Simplified라는 블로그 글을 번역했습니다만... 어쩌다보니 다른 글이 되어버렸네요.'
thumbnail: ''
tags: ['OAuth']
draft: false
created_date: 2025-10-08 18:56:52
---

# OAuth 2 Simplified

[원글: OAuth 2 Simplified, Aaron Parecki](https://aaronparecki.com/oauth-2-simplified/)

저에게 OAuth는 “막연히 구현은 가능하지만, 제대로 설명하기엔 어려운 주제” 중 하나였습니다.

그래서 이번 연휴를 계기로 OAuth 2 Simplified(Aaron Parecki, 2012)를 읽으며
개념을 확실히 다져보고 싶었습니다.

다만 원 글이 2012년에 작성된 만큼, 지금과 맞지 않는 부분이나 직관적이지 않은 표현들이 조금 섞여 있었습니다.
따라서 원문을 바탕으로 제가 알고 있는 지식을 곁들여 재해석하며 번역을 해보았습니다.

사실 본래 글과는 거의 다른 글이 된 것 같습니다. 그래도 원글의 핵심 의도인 **“OAuth를 더 쉽게 이해하고, 바로 구현할 수 있게 하자”** 는 그대로 담고자 했으니 재미있게 읽어주시면 감사하겠습니다.

이 글은 OAuth를 처음 구현해보는 분들,
혹은 구현은 해봤지만 내부 동작 원리를 좀 더 명확히 이해하고 싶으신 분들을 위해 작성했습니다.

혹시 제가 틀린 내용을 기재했거나, 더 나은 설명이 있다면 거침없는 의견 부탁드립니다. 감사합니다.

---

## 역할(Roles)

OAuth의 **역할(Roles)** 은 인증 과정에 참여하는 여러 주체를 구분하는 개념입니다.
OAuth는 단일 시스템이 아닌 여러 구성요소가 협력하여 **인증**과 **인가**를 수행하는 구조이기 때문에,
각 주체가 **어떤 책임과 권한을 가지고 있는지 명확히 이해하는 것이 핵심**입니다.

<Description title="인증과 인가">
인증(Authentication) - "그대는 누구인가?"

인가(Authorization) - "누구인지는 알겠고, 넌 어디까지 접근할 수 있는가?"
</Description>

### 클라이언트(Client)

클라이언트(Client) 는 사용자의 계정에 접근하려는 애플리케이션입니다. 클라이언트가 사용자 계정에 접근하려면 반드시 사용자의 접근 권한(Permission) 을 얻어야 합니다.

- 예시: “구글로 로그인” 버튼을 제공하는 배달의민족 앱 또는 Notion 웹앱

### 리소스 서버(Resource Server)

리소스 서버(Resource Server)는 인가 서버가 발급한 Access Token을 검증한 뒤, 유효한 요청에 한해 보호된 사용자 데이터(리소스)에 접근을 허용하는 API 서버입니다.

- 예시: Google People API — Access Token을 검증한 뒤, 구글 계정의 이름·이메일 등 사용자 정보를 반환

### 인가 서버(Authorization Server)

인가 서버(Authorization Server) 는 사용자의 로그인 및 동의 과정을 처리하고, 앱이 요청한 권한(Scope)을 승인하면 Authorization Code를 발급한 뒤, 그 코드를 이용해 Access Token을 교환·발급하는 역할을 담당합니다.

- 예시: accounts.google.com — 구글 계정 로그인과 동의 화면을 표시하고, Authorization Code 및 Access Token을 발급하는 서버

### 리소스 소유자(Resource Owner)

리소스 소유자는 자신의 데이터(리소스)에 대한 접근 권한을 가진 주체로, OAuth에서는 제3자 애플리케이션(Client)에게 그 권한을 위임합니다.

- 예시: “구글로 로그인”을 눌러 Notion이 내 이름·이메일에 접근하도록 허용하는 실제 사용자

<Hint>
앞으로 아래에서 구현 단계를 살펴볼 때, 각 과정마다 어떤 Role이 등장하는지는 따로 언급하지 않겠지만,
“지금 이 동작은 클라이언트일까, 인가 서버일까?” 하고 스스로 짚어보면 이해 속도가 훨씬 빨라질 것입니다.
</Hint>

---

## 애플리케이션 생성 (Creating an App)

OAuth를 쓰려면 **먼저 OAuth 제공자(Google, Github, Kakao 등)에게 "내가 이런 앱을 만들건데, 당신네들 로그인 시스템 좀 쓸게요." 하고 애플리케이션 등록을 먼저 해야 합니다.**

여기서 등록해야 하는 정보는 기본적으로 다음과 같습니다.

- 앱 이름, 웹사이트 주소
- Redirect URL (인증 완료 후 사용자를 돌려보낼 주소)

이 단계는 "나는 이런 목적의 앱을 운영할 거야"라고 OAuth 제공자에게 신원을 밝히는 단계라고 생각하시면 됩니다. 사업하기 전, 공공기관에 사업자 등록을 내는 것과 비슷합니다.

### Redirect URIs

인증이 끝난 사용자를 어디로 돌려보낼지 명시하는 주소입니다. OAuth 인증 후 자동으로 돌아오는 페이지가 바로 이 URI라고 보시면 됩니다. 보통은 다음 주소처럼 구성됩니다.

- 웹: `https://example.com/auth/google/callback`
- 앱(React Native, Expo): `myapp://auth/redirect`

> 네이티브 앱은 애플리케이션 고유의 커스텀 URL 스킴으로 리디렉션 URI를 등록할 수 있습니다.  
> 예: `demoapp://redirect`

### Client ID와 Client Secret

앱 등록이 끝나면 OAuth 제공자는 Client ID를 발급하고, 선택적으로 Client Secret을 발급합니다.

- **Client ID**: 앱의 공개 식별자. “이 요청은 누구 앱에서 왔는가”를 구분하기 위해 존재합니다. (ex. 사업자등록번호)
- **Client Secret**: 서버에서만 사용해야 하는 비밀키. 토큰 교환 시 자신임을 증명합니다. (ex. 인감도장)

<Hint>
Client ID는 공개되어도 상관없습니다. 따라서 브라우저나 앱 코드에 포함되어도 괜찮습니다.  
그러나 Client Secret은 반드시 **서버 환경**에서만 안전하게 관리해야 합니다.  
만약 배포된 애플리케이션이 Secret을 안전하게 보관할 수 없는 환경이라면 Secret은 사용하면 안 됩니다.
</Hint>

### 정리

- **App 등록**: OAuth 제공자에게 내 앱을 공식적으로 등록하는 과정
- **Redirect URI**: 인증 후 사용자를 돌려보낼 주소
- **Client ID**: 앱의 공개 식별자
- **Client Secret**: 서버에서만 사용하는 비밀키 (클라이언트에 공개 금지)

---

## 인가(Authorization)

OAuth의 첫 번째 단계는 사용자로부터 인가(Authorization)를 받는 것입니다.
쉽게 말해, “나는 구글 사용자이고, 이 앱이 내 구글 계정 정보에 접근하는 것을 허락하겠다”라고 승인하는 과정입니다.

이때 브라우저나 모바일 앱은 OAuth 제공자(예: Google, GitHub)가 제공하는 **동의 화면(Consent Screen)** 을 표시해서 사용자의 승인을 받습니다.

<img width="353" height="755" alt="Image" src="https://github.com/user-attachments/assets/4d43fafb-d501-47c1-ad57-4a65df00b3cc" />

### Grant Type (인가 방식)

OAuth에는 여러 상황에 맞는 **“인가 방식(Grant Type)”** 이 존재합니다. 즉, 앱이 어떤 환경에서 실행되는지에 따라 토큰을 얻는 절차가 다릅니다.

| 인가 방식 (Grant Type) | 설명                                                                                                  | 사용 예시                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Authorization Code** | 가장 일반적이고 보안성이 높은 방식. 인가 코드를 발급받아 서버에서 Access Token으로 교환함.            | 웹 앱, 모바일 앱 (PKCE 포함) |
| **Password**           | 사용자 이름과 비밀번호를 직접 입력받아 로그인하는 방식. 1st-party 앱에서만 사용됨.                    | 내부 관리용 시스템           |
| **Client Credentials** | 사용자가 없는 환경에서 애플리케이션 간 통신을 위해 토큰을 발급받는 방식.                              | 서버 ↔ 서버 API 통신        |
| **Implicit (구식)**    | 과거엔 Secret이 없는 앱을 위한 방식이었지만, 현재는 PKCE를 사용하는 Authorization Code Flow로 대체됨. | (Deprecated)                 |

> 💡 대부분의 실제 서비스(Google, GitHub, Kakao 등)는 **Authorization Code 방식**을 사용합니다.
> 나머지 방식은 내부 관리용 또는 서버 간 통신처럼 **특수한 환경**에서만 쓰입니다.

---

## 기본 예시 (클라이언트-서버)

원문에서는 `Node.js + Pug`, `Spring + JSP`와 같이
서버 렌더링 기반 웹 애플리케이션을 중심으로 OAuth 적용 과정을 설명하고 있습니다.

원리는 동일하지만, 처음 OAuth를 접하는 분들에게는
서버 렌더링 구조가 다소 혼란스럽게 느껴질 수 있습니다.

그래서 이 글에서는 현재 많이 사용되는 SPA(React, Vue) + 백엔드 서버 구조를 기준으로
OAuth 2.0 인증 과정을 정리해보겠습니다.

### 인가 과정 (Authorization Flow)

OAuth 인증의 첫 단계는 사용자를 로그인 페이지로 리디렉션시키는 것입니다. 예를 들어, “구글로 로그인” 버튼을 클릭하면 다음과 같은 주소로 이동시킵니다:

```
https://authorization-server.com/auth?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=REDIRECT_URI&
  scope=photos&
  state=1234zyx
```

각 파라미터는 아래처럼 동작합니다:

| 파라미터               | 설명                                                                        |
| ---------------------- | --------------------------------------------------------------------------- |
| **response_type=code** | 서버가 **인가 코드(authorization code)** 를 받을 것임을 명시                |
| **client_id**          | 앱 등록 시 발급받은 **Client ID**                                           |
| **redirect_uri**       | 인증이 끝난 후 사용자를 돌려보낼 주소                                       |
| **scope**              | 앱이 접근을 요청하는 사용자 데이터 범위 (예: `photos`, `email`)             |
| **state**              | 앱이 생성한 임의의 문자열로, 요청 위조(CSRF) 공격을 방지하기 위한 검증용 값 |

### 동의 화면 (Consent Screen)

사용자는 아래와 같은 동의 화면(Consent Screen)을 보게 됩니다. 이 화면은 OAuth 제공자(예: 구글, 깃허브, 카카오)가 직접 렌더링합니다.

<img width="353" height="755" alt="Image" src="https://github.com/user-attachments/assets/4d43fafb-d501-47c1-ad57-4a65df00b3cc" />

사용자가 “허용(Allow)”을 클릭하면,
OAuth 서버는 사용자를 등록된 리디렉션 주소로 다시 이동시킵니다.

```
https://example-app.com/cb?code=AUTH_CODE_HERE&state=1234zyx
```

| 파라미터  | 설명                                                  |
| --------- | ----------------------------------------------------- |
| **code**  | 인가 서버가 발급한 **인가 코드 (Authorization Code)** |
| **state** | 요청 시 전달했던 **state 값** (반드시 동일해야 함)    |

<Hint>
💡 state 검증은 필수입니다.
처음 보냈던 state 값과 되돌아온 값을 비교해 일치하지 않으면 요청을 거부해야 합니다.
이렇게 하면 악성 사이트가 임의의 인가 코드를 보내는 공격을 막을 수 있습니다.
</Hint>

### Access Token 교환 (Getting an Access Token)

클라이언트(SPA)는 받은 code를 백엔드 서버로 전달합니다.

서버는 이 인가 코드를 이용해 OAuth 제공자의 토큰 발급 API에 요청을 보냅니다.
이 요청은 서버에서만 수행되므로 Client Secret을 안전하게 포함할 수 있습니다.

```
POST https://api.authorization-server.com/token
  grant_type=authorization_code&
  code=AUTH_CODE_HERE&
  redirect_uri=REDIRECT_URI&
  client_id=CLIENT_ID&
  client_secret=CLIENT_SECRET
```

| 파라미터                          | 설명                                            |
| --------------------------------- | ----------------------------------------------- |
| **grant_type=authorization_code** | 인가 코드 플로우임을 명시                       |
| **code**                          | 인가 단계에서 발급받은 코드                     |
| **redirect_uri**                  | 최초 요청 시 사용한 리디렉션 주소와 동일해야 함 |
| **client_id / client_secret**     | 앱 등록 시 발급받은 ID와 비밀키                 |

서버는 다음과 같은 응답을 받습니다:

```json
{
  "access_token": "RsT5OjbzRn430zqMLgV3Ia",
  "expires_in": 3600
}
```

이제 서버는 이 Access Token을 클라이언트에게 전달하거나, 서버가 대신 외부 API(예: 구글, 깃허브)에 요청을 보낼 수 있습니다.

### Access Token을 이용해 데이터 요청

Access Token을 사용해 구글, 깃허브, 카카오 등 OAuth 제공자의 API로부터 사용자 정보를 가져올 수 있습니다.

예를 들어, 구글의 People API를 통해 사용자 정보를 요청할 수 있습니다:

```bash
curl -H "Authorization: Bearer RsT5OjbzRn430zqMLgV3Ia" \
https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses
```

---

## 회고

오랜만에 집중해서 번역하고 공부할 수 있었던, 의미 있는 시간이었습니다.
평소에 막연하게만 알고 있던 OAuth의 구조를 글로 정리하면서
“이제는 제대로 이해했다”는 느낌을 받을 수 있었습니다.

다만, 여기에서 제시한 파라미터들이 모든 OAuth 제공자의 파라미터와 1:1로 정확히 대응되지는 않을 수 있습니다.
OAuth는 서비스마다 세부 구현이 조금씩 다를 수 있기 때문입니다.
그럼에도 이 글이 OAuth의 큰 흐름과 개념을 이해하는 데 도움이 되길 바랍니다.
