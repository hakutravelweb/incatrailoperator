'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { AttractionProduct } from '@/interfaces/attraction-product'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Modal } from '@/components/ui/modal'

interface Props {
  attractionProduct: AttractionProduct
}

export function Banner({ attractionProduct }: Props) {
  const t = useTranslations('AttractionProduct')
  const photos = attractionProduct.photos.slice(0, 3)
  const morePhotos = attractionProduct.photos.length - photos.length
  const sizes = [
    'col-[1/3] row-[1/3]',
    'col-[3/5] row-[1/2]',
    'col-[3/5] row-[2/3]',
  ]
  const gallery = useDisclosure()
  const [current, setCurrent] = useState<number>(0)
  const photo = useMemo(() => {
    return attractionProduct.photos[current]
  }, [attractionProduct.photos, current])

  const handleViewPhoto = (current: number) => () => {
    if (photos[current]) {
      setCurrent(current)
      gallery.onOpen()
    }
  }

  const handlePrev = () => {
    const prev = current - 1
    if (prev < 0) {
      setCurrent(attractionProduct.photos.length - 1)
    } else {
      setCurrent(prev)
    }
  }

  const handleNext = () => {
    const next = current + 1
    if (next > attractionProduct.photos.length - 1) {
      setCurrent(0)
    } else {
      setCurrent(next)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-1'>
        <Link
          href='/'
          className='text-dark-charcoal text-base leading-5 hover:underline'
        >
          {t('country')}
        </Link>
        <Icons.Right className='text-dav-ys-grey size-4' />
        <Link
          href={`/destination/${attractionProduct.destination}`}
          className='text-dark-charcoal text-base leading-5 hover:underline'
        >
          {attractionProduct.destination}
        </Link>
      </div>
      <div className='bg-strong-dark-green relative -mx-6 h-80 lg:mx-0 lg:overflow-hidden lg:rounded-xl'>
        <div className='grid size-full grid-cols-4 grid-rows-2 gap-2'>
          {photos.map((photo, index) => {
            return (
              <div
                key={index}
                onClick={handleViewPhoto(index)}
                className={`cursor-pointer ${sizes[index]}`}
              >
                <img
                  className='size-full object-cover'
                  src={getFullMediaUrl(photo)}
                  alt={attractionProduct.title}
                  loading='lazy'
                />
              </div>
            )
          })}
        </div>
        {morePhotos > 0 && (
          <button
            onClick={gallery.onOpen}
            className='hover:bg-anti-flash-white active:bg-chinese-white absolute right-4 bottom-4 flex cursor-pointer items-center justify-center gap-1 rounded-full bg-white px-4 py-2 transition-colors duration-100'
          >
            <Icons.PhotoPlus className='size-5' />
            <span className='text-sm leading-4.5 font-medium'>
              {t('view-all-photos')}
            </span>
          </button>
        )}
        <Modal
          variant='preview'
          isOpen={gallery.isOpen}
          onClose={gallery.onClose}
        >
          <div className='flex flex-col gap-4'>
            <strong className='text-xl leading-7'>
              {attractionProduct.title}
            </strong>
            <div className='bg-strong-dark-green relative flex items-center justify-center'>
              <button
                onClick={handlePrev}
                className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2/4 left-5 flex size-10 -translate-y-2/4 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
              >
                <Icons.ArrowLeft onClick={handlePrev} className='size-6' />
              </button>
              <button
                onClick={handleNext}
                className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2/4 right-5 flex size-10 -translate-y-2/4 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
              >
                <Icons.ArrowRight onClick={handlePrev} className='size-6' />
              </button>
              {photo && (
                <img
                  className='aspect-video object-contain'
                  src={getFullMediaUrl(photo)}
                  alt={attractionProduct.title}
                  loading='lazy'
                />
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
