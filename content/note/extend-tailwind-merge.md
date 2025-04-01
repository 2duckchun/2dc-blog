---
title: 'extend-tailwind-merge size 오버라이드'
description: 'extend-tailwind-merge size 오버라이딩 기록'
thumbnail: ''
tags: ['tailwindcss']
draft: false
created_date: 2025-04-01 23:29:15
---

# extend-tailwind-merge size 오버라이드

twMerge 함수의 override 옵션에서 h, w 등은 size 그룹에 속해있다.
따라서 `size : [{h: []}, {w: []}]` 형식으로 클래스네임을 추가해줘야 한다.

##

```ts
export function cn(...inputs: ClassValue[]) {
  const twMerge = extendTailwindMerge({
    override: {
      classGroups: {
        'font-size': [
          {
            text: [...Object.keys(TailwindTheme.text)]
          }
        ],
        size: [
          {
            h: [...Object.keys(TailwindTheme.spacing)]
          }
        ]
      },
      theme: {
        colors: [...Object.keys(TailwindTheme.color)]
      }
    }
  })
  return twMerge(clsx(inputs))
}
```
