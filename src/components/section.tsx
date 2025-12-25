import { PropsWithChildren } from 'react'

export function Section({ children }: PropsWithChildren) {
  return (
    <section className='xlg:w-section xlg:max-w-full xlg:mx-auto px-6'>
      {children}
    </section>
  )
}
