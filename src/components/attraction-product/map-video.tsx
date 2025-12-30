'use client'
import { getFullMediaUrl } from '@/lib/utils'
import { AttractionProduct } from '@/interfaces/attraction-product'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Modal } from '@/components/ui/modal'

interface Props {
  attractionProduct: AttractionProduct
}

export function MapVideo({ attractionProduct }: Props) {
  const map = useDisclosure()

  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
      {attractionProduct.attractionMap && (
        <div
          onClick={map.onOpen}
          className='bg-anti-flash-white aspect-video cursor-pointer overflow-hidden rounded-xl'
        >
          <img
            className='size-full object-contain'
            src={getFullMediaUrl(attractionProduct.attractionMap)}
            alt={attractionProduct.title}
            loading='lazy'
          />
        </div>
      )}
      {attractionProduct.attractionVideo && (
        <div className='bg-anti-flash-white aspect-video overflow-hidden rounded-xl'>
          <embed
            className='size-full object-cover'
            src={attractionProduct.attractionVideo}
            title={attractionProduct.title}
          />
        </div>
      )}
      <Modal variant='preview' isOpen={map.isOpen} onClose={map.onClose}>
        <div className='flex flex-col gap-4'>
          <strong className='text-xl leading-7'>
            {attractionProduct.title}
          </strong>
          <img
            className='aspect-video object-contain'
            src={getFullMediaUrl(attractionProduct.attractionMap)}
            alt={attractionProduct.title}
            loading='lazy'
          />
        </div>
      </Modal>
    </div>
  )
}
