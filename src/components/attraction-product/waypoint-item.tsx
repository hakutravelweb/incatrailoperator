import { Waypoint } from '@/interfaces/attraction-product'

interface Props {
  waypoint: Waypoint
}

export function WaypointItem({ waypoint }: Props) {
  return (
    <div className='flex items-baseline gap-2'>
      <div className='border-inferno flex size-6 items-center justify-center rounded-full border-2'>
        <div className='bg-inferno size-4 rounded-full' />
      </div>
      <div className='flex flex-1 flex-col gap-1'>
        <span className='text-inferno text-base leading-6 font-medium'>
          {waypoint.time}
        </span>
        <span className='text-base leading-5.25 font-bold'>
          {waypoint.title}
        </span>
        <span className='text-dark-charcoal text-base leading-6'>
          {waypoint.description}
        </span>
      </div>
    </div>
  )
}
