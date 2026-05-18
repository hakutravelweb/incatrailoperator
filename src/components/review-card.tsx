import { useLocale } from 'next-intl'
import { formatDate } from '@/lib/utils'
import { Review } from '@/interfaces/review'
import { Rating } from './journey/rating'

interface Props {
  review: Review
}

export function ReviewCard({ review }: Props) {
  const locale = useLocale()

  const bgColors = [
    'bg-inferno',
    'bg-blue-fire',
    'bg-dark-jade',
    'bg-abstract-navy',
    'bg-camouflage-blue',
  ] as const

  const index = review.traveller.fullname.charCodeAt(0) % bgColors.length
  const bgClass = bgColors[index]

  return (
    <div className='flex flex-1 flex-col gap-4 py-6'>
      <div className='flex items-center gap-1'>
        <Rating rating={review.rating} />
        <span className='text-sm leading-4'>{review.rating}</span>
      </div>
      <div className='flex items-center gap-4'>
        <div
          className={`${bgClass} flex size-10 items-center justify-center rounded-full`}
        >
          <span className='text-2xl leading-7.5 font-bold text-white uppercase'>
            {review.traveller.fullname.charAt(0)}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-sm leading-5 font-medium'>
            {review.traveller.fullname} - {review.traveller.country}
          </span>
          <span className='text-nevada text-sm leading-5'>
            {formatDate({
              locale,
              date: new Date(review.createdAt),
              options: {
                month: 'long',
                year: 'numeric',
              },
            })}
          </span>
        </div>
      </div>
      <span className='text-base leading-5.5'>{review.comment}</span>
    </div>
  )
}
