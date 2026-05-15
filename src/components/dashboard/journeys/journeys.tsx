'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { JourneyView } from '@/interfaces/journey'
import { useJourneysPagination } from '@/hooks/use-journeys-pagination'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { JourneyItem } from './journey-item'
import { JourneyCreate } from './journey-create'
import { JourneyUpdate } from './journey-update'
import { JourneyItinerary } from './journey-itinerary'
import { JourneyAskedQuestions } from './journey-asked-questions'
import { JourneyReviews } from './journey-reviews'

export function Journeys() {
  const t = useTranslations('Dashboard')
  const journeys = useJourneysPagination()
  const [journeyId, setJourneyId] = useState<string>('')
  const [journeyView, setJourneyView] = useState<JourneyView>('JOURNEYS')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    journeys.onSearch(text)
  }

  const handleChangeView = (view: JourneyView) => (id?: string) => {
    if (id) {
      setJourneyId(id)
    }
    setJourneyView(view)
  }

  if (journeyView === 'REVIEWS') {
    return (
      <JourneyReviews
        journeyId={journeyId}
        onClose={handleChangeView('JOURNEYS')}
      />
    )
  }

  if (journeyView === 'FAQS') {
    return (
      <JourneyAskedQuestions
        journeyId={journeyId}
        onClose={handleChangeView('JOURNEYS')}
      />
    )
  }

  if (journeyView === 'ITINERARY') {
    return (
      <JourneyItinerary
        journeyId={journeyId}
        onClose={handleChangeView('JOURNEYS')}
      />
    )
  }

  if (journeyView === 'EDIT') {
    return (
      <JourneyUpdate
        journeyId={journeyId}
        onClose={handleChangeView('JOURNEYS')}
        onRefresh={journeys.onRefresh}
      />
    )
  }

  if (journeyView === 'CREATE') {
    return (
      <JourneyCreate
        onClose={handleChangeView('JOURNEYS')}
        onRefresh={journeys.onRefresh}
      />
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
        <div className='border-chinese-white flex w-75 items-center gap-2 rounded-full border-2 px-4 focus-within:divide-black focus-within:border-black'>
          <Icons.Search className='size-5' />
          <input
            type='text'
            className='text-dark-charcoal flex-1 py-2 text-sm leading-4.5 outline-hidden'
            value={journeys.search}
            onChange={handleChange}
            placeholder={t('journey.search-placeholder')}
          />
        </div>
        <Button
          variant='action'
          widthFit
          icon='Plus'
          onClick={handleChangeView('CREATE')}
        >
          {t('journey.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!journeys.loading && journeys.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('journey.empty-message')}
            </span>
          </div>
        )}
        {journeys.loading && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {journeys.data.map((journey) => {
          return (
            <JourneyItem
              key={journey.id}
              journey={journey}
              onEdit={handleChangeView('EDIT')}
              onItinerary={handleChangeView('ITINERARY')}
              onAskedQuestions={handleChangeView('FAQS')}
              onReviews={handleChangeView('REVIEWS')}
              onRefresh={journeys.onRefresh}
            />
          )
        })}
      </div>
      <Pagination
        limit={journeys.limit}
        offset={journeys.offset}
        total={journeys.total}
        onOffset={journeys.onOffset}
      />
    </div>
  )
}
