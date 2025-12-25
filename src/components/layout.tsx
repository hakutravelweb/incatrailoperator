import { PropsWithChildren } from 'react'
import { Header } from '@/components/header'

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
