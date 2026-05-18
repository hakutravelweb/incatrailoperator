'use client'
import { useLocale } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatTime } from '@/lib/utils'
import { Waypoint } from '@/interfaces/journey'

interface Props {
  waypoint: Waypoint
}

export function WaypointItem({ waypoint }: Props) {
  const locale = useLocale()

  return (
    <div className='flex gap-3'>
      <div className='bg-dotted-line'>
        <div className='shadow-main-small bg-abstract-navy flex size-8 items-center justify-center rounded-full'>
          <Icons.Waypoint className='size-6 text-white' />
        </div>
      </div>
      <div className='flex flex-1 flex-col pb-4'>
        <span className='flex-1 text-base leading-5.5 font-medium'>
          {waypoint.title}
        </span>
        <span className='text-sm leading-5'>{waypoint.description}</span>
        <span className='text-nevada mt-0.5 text-sm leading-5 font-medium'>
          {formatTime(locale, waypoint.time)}
        </span>
      </div>
    </div>
  )
}
