---
title: 'react-pdf 활용기'
description: 'PDF 렌더링을 위해 react-pdf를 사용했습니다.'
thumbnail: ''
tags: ['frontend']
draft: true
created_date: 2025-05-02 12:20:46
---

# react-pdf 활용기

PDF 렌더링을 구현해야 하는 일이 있었습니다. 이를위해 iframe를 사용해볼까 생각했습니다만, 브라우저별로 UX가 달라질 것이라 생각하니 별로 좋은 구현 방법은 아닌 것 같았습니다.

필요한건 단순한 렌더링 뿐이었습니다. 렌더링만 빠르고 간단하게 할 수 있는 방법이 없을까 생각하다가 결국 react-pdf라는 라이브러리를 찾아서 활용하게 되었습니다.

다른 라이브러리를 사용하는 것 처럼 뚝딱 사용할 수 있을 줄 알았는데, 브라우저 워커에 pdf 엔진을 연결해주어야 하는 면에서 약간 새로웠습니다.

react-pdf를 활용하는 방법에 대해 공유하겠습니다.

## 설치

```bash
pnpm install react-pdf
```

## 코드

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

export function BondAssignmentPdfViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setPageNumber(numPages)
  }

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width)
      }
    }
    setTimeout(updateWidth, 0)
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  return (
    <div ref={containerRef}>
      <Document
        file={
          // sample pdf
          'https://sccrtc.org/wp-content/uploads/2010/09/SampleContract-Shuttle.pdf'
        }
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} width={containerWidth} />
      </Document>
    </div>
  )
}
```

대략적인 사용방법은 위와 같습니다. workerSrc에 pdf worker를 붙여줘야만 react-pdf가 정상적으로 동작합니다.
worker의 재미있는 점은 자바스크립트 파일로만 동작한다는 것입니다. 아무래도 런타임에 바로 적용이 가능한 코드를 넣어야 하기 때문이겠지요.

인터넷에 떠돌아다니는 블로그에는 cdn으로 workerSrc를 채워넣던데, 최근에는 그게 잘 동작하지 않는 것 같습니다. ESM으로 넘어오고 난 뒤부터 동작이 잘 안된다고 하는데, 추가적인 확인이 필요할 것 같습니다.

next.js와 같은 SSR을 지원하는 프레임워크의 경우, useEffect 바깥에서 workerSrc에 자바스크립트 파일을 할당하면 window를 찾을 수 없다던가, dynamic import를 할 수 없다던가 하는 에러가 뜹니다. 우리가 필요한 것은 CSR 환경의 브라우저 워커이니 적절하게 인지하여 활용을 해야할 것입니다.

### workerSrc

### worker의 역할
