import { PropsWithChildren } from 'react'

export function Section({ children }: PropsWithChildren) {
  return (
    <section className='mx-auto w-full max-w-350 px-8 lg:px-18'>
      {children}
    </section>
  )
}
