import '../src/style/globals.css'
import type { Metadata } from 'next'
import { pretendard } from '@/lib/font'

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.2duckchun.com'),
  title: `2DC - blog`,
  description: '2DC의 개인 블로그',
  verification: {
    other: {
      'naver-site-verification': '5da2532700825226e569779beb872ba677c13472',
      'google-site-verification': 'b3fTGYsUtZnvAfwHJri3JPJC5h1Chn_vGLdfPuCAb9g'
    }
  },
  openGraph: {
    images: `/images/profile.png`,
    description: '2DC의 개인 블로그'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
