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
      className='flex cursor-pointer items-center gap-3'
    >
      <div
        className={cn(
          'border-pewter-metallic flex size-6 items-center justify-center rounded-sm border-2 transition-colors duration-200',
          {
            'border-blue-fire bg-blue-fire': active,
          },
        )}
      >
        {active && <Icons.Check className='size-5 text-white' />}
      </div>
      <span className='text-base leading-5.5'>{children}</span>
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
      className='flex cursor-pointer items-center gap-3'
    >
      <div
        className={cn(
          'border-pewter-metallic flex size-6 items-center justify-center rounded-sm border-2 transition-colors duration-200',
          {
            'border-blue-fire bg-blue-fire': active,
          },
        )}
      >
        {active && <Icons.Check className='size-5 text-white' />}
      </div>
      <span className='text-base leading-5.5'>{children}</span>
    </div>
  )
}
