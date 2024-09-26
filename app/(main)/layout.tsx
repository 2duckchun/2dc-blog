import { Footer } from '@/components/layouts/container/footer'
import { Header } from '@/components/layouts/container/header'

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
