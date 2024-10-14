---
title: '[nest.js] 순환 종속성(Circular Dependency) 공식문서 번역'
description: '역시 공식문서를 잘 읽고 개발을 해야합니다. 모르고 개발하다가 몇 시간을 데였습니다.'
thumbnail: '/images/nest.svg'
tags: [backend]
draft: false
created_date: 2024-09-26 22:41:00
---

## 들어가며...

nest.js를 이용해 개발하던 중 뭔가 코드상 논리가 크게 어긋난 것이 아닌데도 불구하고 모듈, 서비스 등록이 안되어 네스트 앱 이니시에이팅이 되지 않는 현상이 발생했습니다. 검색을 해보니 nest.js는 순환 종속성에 대한 문제점을 인지하면서 개발을 해야하더군요. 비단 nest.js의 문제가 아니라 디자인 패턴 상 그럴 수 밖에 없는 문제가 있지 않을까 싶긴 합니다. 아리까리한 느낌이 드는 것을 보니 공부를 더 해야겠습니다.

아무튼 순환 종속성이라는 문제에 대해 하나 더 알아갈 수 있는 좋은 기회가 되었습니다. 오늘은 이를 다룬 nest.js의 공식문서를 읽고 번역을 남겨봅니다.

# 순환 종속성(Circular Dependency)

순환 종속성은 **두 클래스가 서로 의존**할 때 발생합니다. 예를 들어 `클래스 A`에는 `클래스 B`가 필요하고, `클래스 B`에도 `클래스 A`가 필요한 경우 순환 종속성이 발생할 수 있습니다. 이러한 순환 종속 문제는 nest의 module 사이 또는 provider 사이에서도 발생합니다.

순환 종속성 문제는 가능한 한 피해야 하지만 항상 그럴 수는 없습니다. 이러한 문제를 피하기 위해서 nest에서는 두 가지 방법을 제안합니다. 하나는 `forward referencing`을 사용하는 것이고, 두번째 방법은 `ModuleRef` 클래스를 사용하여 Provider를 DI container에서 전달하는 것입니다.

## Forward reference

`forward reference`를 사용하면 **forwardRef() 유틸리티 함수를 통해 아직 정의되지 않은 클래스를 참조**할 수 있습니다. 예를 들어 CatsService와 CommonService가 서로 의존하는 경우 관계의 양쪽에서 `@Inject()` 및 `forwardRef()` 유틸리티를 사용하여 순환 종속성 문제를 해결할 수 있습니다. 이렇게 하지 않으면 모든 필수 메타데이터를 사용할 수 없게 되므로 nest에서 인스턴스화 되지 않습니다. 아래는 예시입니다.

```ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService
  ) {}
}
```

<Hint>`forwardRef()`는 `@nestjs/common` 패키지에서 import할 수 있습니다.</Hint>

이로써 관계의 한 면을 다루었습니다. CommonService에서도 똑같이 해보겠습니다.

```ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService
  ) {}
}
```

## ModuleRef 클래스 사용

`forwardRef()`를 사용하는 대신 코드를 리팩터링한 후 `ModuleRef` 클래스를 사용하여 순환 관계의 한 쪽에서 provider를 공급하는 방법도 있습니다. ModuleRef에 대해 더 자세히 공부하시려면 [링크](https://docs.nestjs.com/fundamentals/module-ref)를 클릭해주세요.

## Module forward reference

모듈 간의 순환 종속성을 해결하려면 모듈 연결 양쪽에서 동일한 `forwardRef()` 유틸리티 함수를 사용해야 합니다. 예를 들어:

```ts
// common.module.ts
@Module({
  imports: [forwardRef(() => CatsModule)]
})
export class CommonModule {}
```

관계의 한 면인 `CommomModule`에 위와 같이 적용해준 후 `CatsModule` 에도 적용해줍니다.

```ts
// cats.module.ts
@Module({
  imports: [forwardRef(() => CommonModule)]
})
export class CatsModule {}
```

### 참고

1. https://docs.nestjs.com/fundamentals/circular-dependency
2. https://en.wikipedia.org/wiki/Circular_dependency
