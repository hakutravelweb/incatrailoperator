import { Icons } from '@/icons/icon'
import { Route } from '@/interfaces/journey'

interface Props {
  route: Route
}

export function RouteItem({ route }: Props) {
  return (
    <div className='flex gap-3'>
      <div className='bg-dotted-line'>
        <div className='shadow-main-small flex size-8 items-center justify-center rounded-full bg-white'>
          <Icons.Route className='size-6' />
        </div>
      </div>
      <div className='flex-1 pb-8'>
        <span className='text-base leading-5.5 font-medium'>{route.title}</span>
      </div>
    </div>
  )
}
