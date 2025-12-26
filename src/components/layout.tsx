import { PropsWithChildren } from 'react'
import { Localization } from '@/interfaces/root'
import { Header } from '@/components/header'

interface Props {
  localizations: Localization[]
}

export function Layout({ localizations, children }: PropsWithChildren<Props>) {
  return (
    <>
      <Header localizations={localizations} />
      {children}
    </>
  )
}
