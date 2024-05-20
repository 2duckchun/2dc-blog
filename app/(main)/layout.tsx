import { Header } from '@/widgets/layouts/header/Header'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <footer>FOOTER</footer>
    </>
  )
}
