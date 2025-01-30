import { Footer } from '@/widget/layouts/footer'
import { Header } from '@/widget/layouts/header'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
