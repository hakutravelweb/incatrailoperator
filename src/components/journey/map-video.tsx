'use client'
import { getFullMediaUrl } from '@/lib/utils'
import { Journey } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Modal } from '@/components/ui/modal'

interface Props {
  journey: Journey
}

export function MapVideo({ journey }: Props) {
  const map = useDisclosure()

  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
      {journey.photoMap && (
        <div
          onClick={map.onOpen}
          className='bg-anti-flash-white aspect-video cursor-pointer overflow-hidden rounded-xl'
        >
          <img
            className='size-full object-contain'
            src={getFullMediaUrl(journey.photoMap)}
            alt={journey.title}
            loading='lazy'
          />
        </div>
      )}
      {journey.videoUrl && (
        <div className='bg-anti-flash-white aspect-video overflow-hidden rounded-xl'>
          <embed
            className='size-full object-cover'
            src={journey.videoUrl}
            title={journey.title}
          />
        </div>
      )}
      <Modal
        variant='preview'
        title={journey.title}
        isOpen={map.isOpen}
        onClose={map.onClose}
      >
        <img
          className='w-full object-contain md:h-100'
          src={getFullMediaUrl(journey.photoMap)}
          alt={journey.title}
          loading='lazy'
        />
      </Modal>
    </div>
  )
}
