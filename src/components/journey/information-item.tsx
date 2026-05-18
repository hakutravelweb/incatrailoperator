import { PropsWithChildren } from 'react'

interface Props {
  label: string
}

export function InformationItem({ label, children }: PropsWithChildren<Props>) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-base leading-5.5 font-medium'>{label}</span>
      <span className='text-base leading-5.5'>{children}</span>
    </div>
  )
}
