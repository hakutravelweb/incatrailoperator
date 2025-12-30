import { useLocale } from 'next-intl'
import { formatDate } from '@/lib/utils'
import { Review } from '@/interfaces/attraction-product'
import { Rating } from './attraction-product/rating'

interface Props {
  review: Review
}

export function ReviewCard({ review }: Props) {
  const locale = useLocale()

  return (
    <div className='border-anti-flash-white flex flex-col gap-4 rounded-xl border-2 p-4'>
      <Rating rating={review.rating} />
      <div className='flex flex-col gap-2'>
        <strong className='text-base leading-5'>
          {review.traveller.fullname}
        </strong>
        <div className='flex items-center gap-1'>
          <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
            {review.traveller.country}
          </span>
          <span className='text-gray-x11 text-base leading-4.75'>•</span>
          <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
            {formatDate({
              locale,
              date: review.createdAt,
              options: {
                month: 'long',
                year: 'numeric',
              },
            })}
          </span>
        </div>
      </div>
      <span className='text-dark-charcoal text-sm leading-4.5'>
        "{review.comment}"
      </span>
    </div>
  )
}
