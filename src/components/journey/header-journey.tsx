'use client'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Link } from '@/i18n/routing'
import { Journey } from '@/interfaces/journey'
import { Rating } from './rating'

interface Props {
  journey: Journey
}

export function HeaderJourney({ journey }: Props) {
  const t = useTranslations('Journey')

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-1'>
        <Link href='/' className='hover:underline-premium text-base leading-5'>
          {t('country')}
        </Link>
        <Icons.Right className='text-nevada size-4' />
        <Link
          href={`/destination/${journey.destination.slug}`}
          className='hover:underline-premium text-base leading-5'
        >
          {journey.destination.title}
        </Link>
      </div>
      <div className='flex flex-col gap-2'>
        <h1 className='text-[28px] leading-8 font-bold lg:text-[36px] lg:leading-11'>
          {journey.title}
        </h1>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='bg-abstract-navy rounded-sm px-2 py-1 text-sm leading-5 font-medium text-white'>
            {t(`variant.${journey.variant}`)}
          </div>
          <div className='flex items-center gap-2'>
            <Rating variant='large' rating={journey.rating} />
            <span className='text-base leading-5.5 font-medium'>
              {journey.rating.toFixed(1)}
            </span>
          </div>
          <span className='underline-premium text-base leading-5.5 font-medium'>
            {t('reviews-count', {
              quantity: journey.reviewsCount,
            })}
          </span>
          <span className='text-nevada text-base leading-5.5'>•</span>
          <span className='text-nevada text-base leading-5.5'>
            {t('country')}, {journey.destination.title}
          </span>
          <span className='text-nevada text-base leading-5.5'>•</span>
          <span className='text-nevada text-base leading-5.5'>
            {journey.duration.type === 'HOUR'
              ? t('duration-hours', {
                  quantity: journey.duration.quantity,
                })
              : t('duration-days', {
                  quantity: journey.duration.quantity,
                })}
          </span>
          <span className='text-nevada text-base leading-5.5'>•</span>
          <span className='text-nevada text-base leading-5.5'>
            {journey.category.title}
          </span>
        </div>
      </div>
    </div>
  )
}
