'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { getFullMediaUrl } from '@/lib/utils'
import { Journey } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Modal } from '@/components/ui/modal'

interface Props {
  journey: Journey
}

export function MediaGallery({ journey }: Props) {
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
    <div className='relative -mx-8 h-100 lg:mx-0 lg:overflow-hidden lg:rounded-2xl'>
      <div className='grid size-full grid-cols-4 grid-rows-2 gap-2'>
        {photos.map((photo, index) => {
          return (
            <div
              key={index}
              onClick={handleViewPhoto(index)}
              className={`bg-bright-grey cursor-pointer ${sizes[index]} overflow-hidden rounded-sm`}
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
          <button
            onClick={gallery.onOpen}
            className='shadow-main-small hover:bg-faded-white hover:border-faded-white flex cursor-pointer items-center gap-1 rounded-full border-2 border-white bg-white px-6 py-1.5 text-sm leading-5 font-medium transition-colors duration-200'
          >
            <Icons.Photo className='size-4' />
            {t('view-all-photos')}
          </button>
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
            <div className='h-media-photo'>
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
  )
}
