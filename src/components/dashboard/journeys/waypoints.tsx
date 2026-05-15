import { useEffect, useState, startTransition, Suspense } from 'react'
import { useLocale } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Waypoint } from '@/interfaces/journey'
import { getWaypoints } from '@/services/journey'
import { WaypointsList } from './waypoints-list'

interface Props {
  routeId: string
}

export function Waypoints({ routeId }: Props) {
  const locale = useLocale()
  const [waypointsPromise, setWaypointsPromise] = useState<Promise<
    Waypoint[]
  > | null>(null)

  useEffect(() => {
    startTransition(() => {
      setWaypointsPromise(getWaypoints(locale, routeId))
    })
  }, [locale, routeId])

  const handleRefresh = () => {
    startTransition(() => {
      setWaypointsPromise(getWaypoints(locale, routeId))
    })
  }

  return (
    <Suspense fallback={<Icons.Loading className='mx-auto size-6' />}>
      {waypointsPromise ? (
        <WaypointsList
          routeId={routeId}
          waypointsPromise={waypointsPromise}
          onRefresh={handleRefresh}
        />
      ) : (
        <Icons.Loading className='mx-auto size-6' />
      )}
    </Suspense>
  )
}
