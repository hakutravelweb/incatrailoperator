import { cn } from '@/lib/utils'
import { Route } from '@/interfaces/attraction-product'

interface Props {
  index: number
  route: Route
}

export function RouteItem({ index, route }: Props) {
  const step = index + 1

  return (
    <div className='flex items-center gap-2'>
      <div
        className={cn(
          'bg-inferno flex size-8 items-center justify-center rounded-full text-white',
          {
            'bg-yellow-sea': index % 2,
          },
        )}
      >
        <span className='text-base leading-5 font-medium'>{step}</span>
      </div>
      <div
        className={cn(
          'border-l-inferno bg-outrageous-orange/10 flex-1 rounded-lg border-l-4 p-4',
          {
            'border-l-yellow-sea bg-yellow-sea/10': index % 2,
          },
        )}
      >
        <span className='text-base leading-5 font-bold'>{route.title}</span>
      </div>
    </div>
  )
}
