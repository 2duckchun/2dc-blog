import { Footer } from '@/widget/layouts/footer'
import { Header } from '@/widget/layouts/header'
import { IntroduceContainer } from '@/widget/layouts/introduce-container'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <IntroduceContainer />
      {children}
      <Footer />
    </>
  )
}
