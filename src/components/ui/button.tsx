'use client'
import { PropsWithChildren } from 'react'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/routing'

type Variant = 'secondary' | 'outline'

interface Props {
  variant?: Variant
  widthFit?: boolean
  disabled?: boolean
  invalid?: boolean
  icon?: keyof typeof Icons
  onClick?: () => void
}

export function Button({
  variant,
  widthFit,
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
        'not-disabled:hover:bg-camouflage-blue disabled:bg-faded-white disabled:text-pewter-metallic not-disabled:bg-blue-fire disabled:border-faded-white not-disabled:border-blue-fire not-disabled:hover:border-camouflage-blue flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 px-6 py-2.25 transition-colors duration-200 not-disabled:text-white disabled:cursor-not-allowed',
        {
          'not-disabled:bg-abstract-navy not-disabled:hover:bg-camouflage-blue not-disabled:hover:border-camouflage-blue not-disabled:border-abstract-navy not-disabled:text-white':
            variant === 'secondary',
          'not-disabled:hover:border-camouflage-blue not-disabled:hover:text-camouflage-blue not-disabled:border-blue-fire not-disabled:text-blue-fire disabled:text-faded-white not-disabled:bg-white not-disabled:hover:bg-white':
            variant === 'outline',
          'not-disabled:border-cayenne-red not-disabled:text-cayenne-red':
            invalid,
          'w-fit': widthFit,
        },
      )}
    >
      {Icon && <Icon className='size-5' />}
      <span className='text-base leading-5.5 font-medium'>{children}</span>
    </button>
  )
}

export function ButtonLink({
  variant,
  widthFit,
  disabled,
  icon,
  href,
  target,
  children,
}: PropsWithChildren<
  Omit<Props, 'invalid' | 'onClick'> & { href: string; target?: '_blank' }
>) {
  const Icon = icon ? Icons[icon] : null

  return (
    <Link
      href={href}
      target={target}
      className={cn(
        'hover:bg-camouflage-blue bg-blue-fire flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-2.25 text-white transition-colors duration-200',
        {
          'bg-abstract-navy hover:bg-camouflage-blue text-white':
            variant === 'secondary',
          'hover:border-camouflage-blue hover:text-camouflage-blue border-blue-fire text-blue-fire border-2 bg-white py-2 hover:bg-white':
            variant === 'outline',
          'w-fit': widthFit,
          'text-pewter-metallic bg-faded-white border-faded-white pointer-events-none cursor-not-allowed':
            disabled,
          'text-faded-white': disabled && variant === 'outline',
        },
      )}
    >
      {Icon && <Icon className='size-5' />}
      <span className='text-base leading-5.5 font-medium'>{children}</span>
    </Link>
  )
}
