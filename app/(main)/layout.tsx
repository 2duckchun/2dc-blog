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
      <footer className="mt-[125px] flex h-[200px] items-center justify-center border-t-2 text-center text-black">
        Made by 2duckchun
      </footer>
    </>
  )
}
