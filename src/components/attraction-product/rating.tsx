import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

interface Props {
  rating: number
}

export function Rating({ rating }: Props) {
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, index) => {
        const score: number = index + 1
        const active: boolean = score <= rating

        return (
          <Icons.Star
            key={index}
            className={cn('text-chinese-white size-4', {
              'text-yellow-sea': active,
            })}
          />
        )
      })}
    </div>
  )
}
