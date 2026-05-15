import { cn } from '@/lib/utils'
import { Route } from '@/interfaces/journey'

interface Props {
  step: number
  route: Route
}

export function RouteItem({ step, route }: Props) {
  return (
    <div className='flex items-center gap-2'>
      <div
        className={cn(
          'bg-inferno flex size-8 items-center justify-center rounded-full text-white',
          {
            'bg-yellow-sea': step % 2,
          },
        )}
      >
        <span className='text-base leading-5 font-medium'>{step}</span>
      </div>
      <div
        className={cn(
          'border-l-inferno bg-outrageous-orange/10 flex-1 rounded-lg border-l-4 p-4',
          {
            'border-l-yellow-sea bg-yellow-sea/10': step % 2,
          },
        )}
      >
        <span className='text-base leading-5 font-bold'>{route.title}</span>
      </div>
    </div>
  )
}
