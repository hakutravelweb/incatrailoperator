'use client'
import { PropsWithChildren } from 'react'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'menu' | 'primary' | 'action'

interface Props {
  variant?: Variant
  disabled?: boolean
  invalid?: boolean
  icon?: keyof typeof Icons
  onClick?: () => void
}

export function Button({
  variant,
  disabled,
  invalid,
  icon,
  onClick,
  children,
}: PropsWithChildren<Props>) {
  const Icon = icon ? Icons[icon] : null

  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'not-disabled:hover:bg-dark-charcoal not-disabled:active:bg-dav-ys-grey disabled:bg-chinese-white disabled:text-gray-x11 flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3.5 transition-colors duration-100 not-disabled:bg-black not-disabled:text-white not-disabled:active:text-white/50 disabled:cursor-auto',
        {
          'not-disabled:hover:bg-anti-flash-white not-disabled:active:bg-chinese-white not-disabled:active:text-dav-ys-grey py-2.5 not-disabled:bg-white not-disabled:text-black':
            variant === 'menu',
          'not-disabled:bg-inferno not-disabled:hover:bg-outrageous-orange not-disabled:active:bg-cinnabar not-disabled:active:text-dark-charcoal px-6 py-3.5 not-disabled:text-black':
            variant === 'primary',
          'not-disabled:hover:bg-anti-flash-white not-disabled:active:bg-chinese-white not-disabled:active:text-dav-ys-grey border-chinese-white border-2 py-2 not-disabled:bg-white not-disabled:text-black':
            variant === 'action',
          'outline-ue-red outline-2': invalid,
        },
      )}
    >
      {Icon && <Icon className='size-5' />}
      <span className='text-base leading-5 font-bold'>{children}</span>
    </button>
  )
}
