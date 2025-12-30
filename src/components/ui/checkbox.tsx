import { PropsWithChildren } from 'react'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

interface Props {
  active: boolean
  value: string
  onChange: (value: string) => void
}

export function Checkbox({
  active,
  value,
  onChange,
  children,
}: PropsWithChildren<Props>) {
  const handleChange = () => {
    onChange(value)
  }

  return (
    <div
      onClick={handleChange}
      className='flex cursor-pointer items-center gap-2'
    >
      <div
        className={cn(
          'border-chinese-white flex size-6 items-center justify-center rounded-md border-2',
          {
            'border-observatory bg-observatory': active,
          },
        )}
      >
        {active && <Icons.Check className='size-4 text-white' />}
      </div>
      <span className='text-dark-charcoal text-base leading-5 font-medium'>
        {children}
      </span>
    </div>
  )
}

interface NumberProps {
  active: boolean
  value: number
  onChange: (value: number) => void
}

export function CheckboxNumber({
  active,
  value,
  onChange,
  children,
}: PropsWithChildren<NumberProps>) {
  const handleChange = () => {
    onChange(value)
  }

  return (
    <div
      onClick={handleChange}
      className='flex cursor-pointer items-center gap-2'
    >
      <div
        className={cn(
          'border-chinese-white flex size-6 items-center justify-center rounded-md border-2',
          {
            'border-observatory bg-observatory': active,
          },
        )}
      >
        {active && <Icons.Check className='size-4 text-white' />}
      </div>
      <span className='text-dark-charcoal text-base leading-5 font-medium'>
        {children}
      </span>
    </div>
  )
}
