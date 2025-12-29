'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { useDestinationsPagination } from '@/hooks/use-destinations-pagination'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { DestinationItem } from './destination-item'
import { DestinationCreate } from './destination-create'
import { DestinationUpdate } from './destination-update'

export function Destinations() {
  const t = useTranslations('Dashboard')
  const destinationCreate = useDisclosure()
  const destinationUpdate = useDisclosure()
  const destinations = useDestinationsPagination()
  const [destinationId, setDestinationId] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    destinations.onSearch(text)
  }

  const handleEdit = (id: string) => {
    setDestinationId(id)
    destinationUpdate.onOpen()
  }

  if (destinationUpdate.isOpen) {
    return (
      <DestinationUpdate
        destinationId={destinationId}
        onClose={destinationUpdate.onClose}
        onRefresh={destinations.onRefresh}
      />
    )
  }

  if (destinationCreate.isOpen) {
    return (
      <DestinationCreate
        onClose={destinationCreate.onClose}
        onRefresh={destinations.onRefresh}
      />
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
        <div className='divide-chinese-white border-chinese-white flex w-75 divide-x-2 rounded-sm border-2 focus-within:divide-black focus-within:border-black'>
          <div className='p-2'>
            <Icons.Search className='size-5' />
          </div>
          <input
            type='text'
            className='text-dark-charcoal flex-1 p-2 text-sm leading-4.5 outline-hidden'
            value={destinations.search}
            onChange={handleChange}
            placeholder={t('destination.search-placeholder')}
          />
        </div>
        <Button variant='action' icon='Plus' onClick={destinationCreate.onOpen}>
          {t('destination.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!destinations.isPending && destinations.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('destination.empty-message')}
            </span>
          </div>
        )}
        {destinations.isPending && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {destinations.data.map((destination) => {
          return (
            <DestinationItem
              key={destination.id}
              destination={destination}
              onEdit={handleEdit}
              onRefresh={destinations.onRefresh}
            />
          )
        })}
      </div>
      <Pagination
        limit={destinations.limit}
        offset={destinations.offset}
        total={destinations.total}
        onOffset={destinations.onOffset}
      />
    </div>
  )
}
