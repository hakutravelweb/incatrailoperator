import { PropsWithChildren } from 'react'
import { Localization } from '@/shared/interfaces'
import { Header } from './header'
import { Footer } from './footer'

interface Props {
  localizations: Localization[]
}

export function Layout({ localizations, children }: PropsWithChildren<Props>) {
  return (
    <div className='flex flex-col'>
      <Header localizations={localizations} />
      {children}
      <Footer />
    </div>
  )
}
