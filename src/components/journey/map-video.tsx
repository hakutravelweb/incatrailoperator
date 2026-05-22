'use client'
import ReactPlayer from 'react-player'
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
          className='bg-bright-grey aspect-video cursor-pointer overflow-hidden rounded-xl'
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
        <div className='bg-bright-grey aspect-video overflow-hidden rounded-xl'>
          <ReactPlayer
            width='100%'
            height='100%'
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
