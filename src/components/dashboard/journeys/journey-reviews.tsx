'use client'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { useReviewsByJourney } from '@/hooks/use-reviews-by-journey'
import { ReviewItem } from './review-item'

interface Props {
  journeyId: string
  onClose: () => void
}

export function JourneyReviews({ journeyId, onClose }: Props) {
  const t = useTranslations('Dashboard')
  const reviews = useReviewsByJourney(journeyId)

  if (reviews.loading) {
    return (
      <div className='flex justify-center py-2'>
        <Icons.Loading className='size-6' />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='z-overlay sticky top-0 flex items-center gap-2 bg-white py-2'>
        <button
          onClick={onClose}
          className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
        >
          <Icons.Left className='size-5' />
        </button>
        <span className='flex-1 text-lg leading-6 font-bold'>
          {t('review.title')}
        </span>
      </div>
      <div className='divide-bright-grey flex flex-col divide-y'>
        {reviews.data.map((review) => {
          return <ReviewItem key={review.id} review={review} />
        })}
      </div>
    </div>
  )
}
