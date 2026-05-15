'use client'
import { startTransition, Suspense, useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Route } from '@/interfaces/journey'
import { getJourney, getRoutes } from '@/services/journey'
import { RoutesList } from './routes-list'

interface Props {
  journeyId: string
  onClose: () => void
}

export function JourneyItinerary({ journeyId, onClose }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const [title, setTitle] = useState<string>('')
  const [routesPromise, setRoutesPromise] = useState<Promise<Route[]> | null>(
    null,
  )

  useEffect(() => {
    startTransition(async () => {
      const attraction = await getJourney(journeyId)
      setTitle(attraction.title[locale])
      setRoutesPromise(getRoutes(locale, journeyId))
    })
  }, [locale, journeyId])

  const handleRefresh = () => {
    startTransition(() => {
      setRoutesPromise(getRoutes(locale, journeyId))
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-baseline gap-2 py-4'>
        <button
          onClick={onClose}
          className='hover:bg-anti-flash-white active:bg-chinese-white active:text-dark-charcoal flex size-8 cursor-pointer items-center justify-center rounded-full border border-black bg-white transition-colors duration-100'
        >
          <Icons.Left className='size-5' />
        </button>
        <strong className='flex-1 text-2xl leading-7 font-bold'>
          {t('journey.asked-question.title', {
            title,
          })}
        </strong>
      </div>
      <Suspense fallback={<Icons.Loading className='mx-auto size-6' />}>
        {routesPromise ? (
          <RoutesList
            journeyId={journeyId}
            routesPromise={routesPromise}
            onRefresh={handleRefresh}
          />
        ) : (
          <Icons.Loading className='mx-auto size-6' />
        )}
      </Suspense>
    </div>
  )
}
