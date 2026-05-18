import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'large'
  rating: number
}

export function Rating({ variant, rating }: Props) {
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, index) => {
        const score = index + 1
        const active = score <= rating

        return (
          <Icons.Star
            key={index}
            className={cn('text-bright-grey size-4', {
              'size-6': variant === 'large',
              'text-abstract-navy': active,
            })}
          />
        )
      })}
    </div>
  )
}
