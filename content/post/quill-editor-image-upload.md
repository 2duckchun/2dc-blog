---
title: '[구현] AWS Presigned URL을 이용한 Quill 이미지 업로드'
description: '언젠가 쓸 일이 있는 코드라 기록해놓습니다.'
thumbnail: ''
tags: ['implementation']
draft: true
created_date: 2025-05-21 22:58:25
---

# AWS Presigned URL을 이용한 Quill 이미지 업로드

저는 Quill을 좋아합니다. 에디터 본연의 기능에 충실한 단순함. 이것저것 쉽게 탈부착되는 유연함. 무료. 아니 좋아할 수가 없습니다.

무엇보다 Quill에는 훌륭한 이미지 업로드 기능이 내장되어 있습니다. 별도의 구현 없이도 에디터에 이미지 첨부가 가능하죠. 단, 막무가내로 이미지를 첨부할 경우, BASE64로 포맷된 긴 문자열로 파싱된 이미지 파일이 에디터 컨텐츠에 그대로 남습니다. 그 상태 그대로 DB에 저장을 하다간 정말 비용면으로도, 유지보수면으로도, 성능면으로도 재앙이 일어나게 됩니다.

그래서 보통은 이미지를 S3 등에 미리 올려놓고, 스토리지 URL을 에디터에 뿌려주는 방식으로 구현합니다. 가장 보편적인 방식입니다.
이미지를 S3에 저장하는 방법은 여러가지가 있겠습니다만, 전 이번에는 백엔드로부터 AWS S3의 업로드 전용 Presigned URL을 발급받아 이미지를 업로드 하기로 했습니다.

## 1. Quill 코드

먼저 Quill 코드를 살펴보겠습니다.
리액트 환경에서 사용하고 있으므로, Quill을 리액트 전용으로 래핑해주는 라이브러리인 `react-quill-new`를 사용했습니다.
그 외, 이미지 사이즈 조절을 위해 `quill-image-resize-module-ts` 라이브러리를 설치해 추가해줬는데, 이건 이미지 업로드랑은 큰 관련이 없으므로 생략하셔도 무방합니다.

```tsx
// ... 필요한 import 코드
import { useEffect, useMemo, useRef, useState } from 'react'
import { Skeleton } from '@shared/src/ui/skeleton'
import type ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

interface QuillEditorProps extends ReactQuill.QuillOptions {
  className?: string
  value: string
  onChange: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
  modules?: ReactQuill.QuillOptions['modules'] | undefined
  formats?: ReactQuill.QuillOptions['formats'] | undefined
}

const defaultFormats = [
  // ...
  'image'
]

export const QuillEditor = ({
  value,
  onChange,
  onImageUpload,
  className
}: QuillEditorProps) => {
  const [QuillComponent, setQuillComponent] = useState<
    typeof ReactQuill | null
  >(null)

  const quillRef = useRef<ReactQuill>(null)

  const imageHandler = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      try {
        const upload = await onImageUpload?.(file)
        const quill = quillRef.current!.getEditor()
        const range = quill.getSelection(true)
        quill.insertEmbed(range.index, 'image', upload)
        quill.setSelection(range.index + 1)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }
  }

  const extendedModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: { image: imageHandler }
      },
      imageResize: {
        modules: ['Resize', 'DisplaySize']
      }
    }),
    []
  )

  // SSR: false 대응
  useEffect(() => {
    void import('react-quill-new')
      .then(async (module) => {
        const { ImageResize } = await import('quill-image-resize-module-ts')
        module.Quill.register('modules/imageResize', ImageResize)
        setQuillComponent(() => module.default)
      })
      .catch((error) => {
        throw new Error('Error loading Quill editor:', error)
      })
  }, [])

  if (!QuillComponent) {
    return <Skeleton className="styling..." />
  }

  return (
    <div className={cn('styling...', className)}>
      <QuillComponent
        theme="snow"
        value={value}
        ref={quillRef}
        onChange={onChange}
        className={cn('h-[90%] bg-white', className)}
        modules={extendedModules}
        formats={defaultFormats}
      />
    </div>
  )
}
```

위처럼 구성된 modules와 format을 Quill의 인수로 추가하면 에디터에 이미지 업로드 `[디스켓 모양]` 아이콘이 생기고, 아이콘을 클릭하면 imageHandler 함수가 동작합니다.

imageHandler 파일 타입 input을 하나 만들어 이미지를 업로드 하는 형태로 코드가 진행됩니다. 파일을 건네받으면 props로 전달받은 onImageUpload 함수를 호출합니다. 이 함수는 콜백함수로써, Quill 자체는 해당 콜백의 내부구현을 잘 모릅니다. 다만 파일을 건네주면 이미지 URL을 건내주는 것은 자명해야 합니다.

아무튼 Quill은 아래처럼 사용하면 되겠습니다.

```tsx
export const ContentEditorField = () => {
  const form = useFormContext<FormSchema>()
  const { handleQuillImageUpload } = useQuillImageUpload()

  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>내용</FormLabel>
          <FormControl>
            <QuillEditor
              value={field.value}
              onChange={field.onChange}
              onImageUpload={(file) => handleQuillImageUpload(file)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
```

이제 훅을 만들 차례입니다.

## 2. useQuillImageUpload Hook 코드

## 3. 업로드
