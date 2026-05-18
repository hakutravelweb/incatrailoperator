'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Journey } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Rating } from './rating'

interface Props {
  journey: Journey
}

export function Banner({ journey }: Props) {
  const t = useTranslations('Journey')
  const photos = journey.photos.slice(0, 3)
  const morePhotos = journey.photos.length - photos.length
  const sizes = [
    'col-[1/3] row-[1/3]',
    'col-[3/5] row-[1/2]',
    'col-[3/5] row-[2/3]',
  ]
  const gallery = useDisclosure()
  const [current, setCurrent] = useState<number>(0)
  const photo = useMemo(() => {
    return journey.photos[current]
  }, [journey.photos, current])

  const handleViewPhoto = (current: number) => () => {
    if (photos[current]) {
      setCurrent(current)
      gallery.onOpen()
    }
  }

  const handlePrev = () => {
    const prev = current - 1
    if (prev < 0) {
      setCurrent(journey.photos.length - 1)
    } else {
      setCurrent(prev)
    }
  }

  const handleNext = () => {
    const next = current + 1
    if (next > journey.photos.length - 1) {
      setCurrent(0)
    } else {
      setCurrent(next)
    }
  }

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
      <div className='relative -mx-6 h-80 lg:mx-0 lg:overflow-hidden lg:rounded-2xl'>
        <div className='grid size-full grid-cols-4 grid-rows-2 gap-2'>
          {photos.map((photo, index) => {
            return (
              <div
                key={index}
                onClick={handleViewPhoto(index)}
                className={`bg-bright-grey cursor-pointer ${sizes[index]}`}
              >
                <img
                  className='size-full object-cover'
                  src={getFullMediaUrl(photo)}
                  alt={journey.title}
                  loading='lazy'
                />
              </div>
            )
          })}
        </div>
        {morePhotos > 0 && (
          <div className='absolute right-4 bottom-4'>
            <Button
              variant='secondary'
              widthFit
              icon='Photo'
              onClick={gallery.onOpen}
            >
              {t('view-all-photos')}
            </Button>
          </div>
        )}
        <Modal
          variant='preview'
          title={journey.title}
          isOpen={gallery.isOpen}
          onClose={gallery.onClose}
        >
          <div className='relative flex size-full items-center justify-center'>
            <div className='absolute top-2/4 left-6 -translate-y-2/4'>
              <button
                onClick={handlePrev}
                className='shadow-main-small flex size-11 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-200'
              >
                <Icons.Left onClick={handlePrev} className='size-6' />
              </button>
            </div>
            <div className='absolute top-2/4 right-6 -translate-y-2/4'>
              <button
                onClick={handleNext}
                className='shadow-main-small flex size-11 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-200'
              >
                <Icons.Right onClick={handlePrev} className='size-6' />
              </button>
            </div>
            {photo && (
              <div className='aspect-video'>
                <img
                  className='size-full object-contain'
                  src={getFullMediaUrl(photo)}
                  alt={journey.title}
                  loading='lazy'
                />
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  )
}
