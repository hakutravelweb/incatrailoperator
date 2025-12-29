'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { useAttractionProductsPagination } from '@/hooks/use-attraction-products-pagination'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { AttractionProductItem } from './attraction-product-item'
import { AttractionProductCreate } from './attraction-product-create'
import { AttractionProductUpdate } from './attraction-product-update'
import { AttractionProductItinerary } from './attraction-product-itinerary'
import { AttractionProductAskedQuestions } from './attraction-product-asked-questions'

export function AttractionProducts() {
  const t = useTranslations('Dashboard')
  const attractionProductCreate = useDisclosure()
  const attractionProductUpdate = useDisclosure()
  const attractionProductItinerary = useDisclosure()
  const attractionProductAskedQuestions = useDisclosure()
  const attractionProducts = useAttractionProductsPagination()
  const [attractionProductId, setAttractionProductId] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    attractionProducts.onSearch(text)
  }

  const handleEdit = (id: string) => {
    setAttractionProductId(id)
    attractionProductUpdate.onOpen()
  }

  const handleItinerary = (id: string) => {
    setAttractionProductId(id)
    attractionProductItinerary.onOpen()
  }

  const handleAskedQuestions = (id: string) => {
    setAttractionProductId(id)
    attractionProductAskedQuestions.onOpen()
  }

  if (attractionProductAskedQuestions.isOpen) {
    return (
      <AttractionProductAskedQuestions
        attractionProductId={attractionProductId}
        onClose={attractionProductItinerary.onClose}
      />
    )
  }

  if (attractionProductItinerary.isOpen) {
    return (
      <AttractionProductItinerary
        attractionProductId={attractionProductId}
        onClose={attractionProductItinerary.onClose}
      />
    )
  }

  if (attractionProductUpdate.isOpen) {
    return (
      <AttractionProductUpdate
        attractionProductId={attractionProductId}
        onClose={attractionProductUpdate.onClose}
        onRefresh={attractionProducts.onRefresh}
      />
    )
  }

  if (attractionProductCreate.isOpen) {
    return (
      <AttractionProductCreate
        onClose={attractionProductCreate.onClose}
        onRefresh={attractionProducts.onRefresh}
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
            value={attractionProducts.search}
            onChange={handleChange}
            placeholder={t('attraction.search-placeholder')}
          />
        </div>
        <Button
          variant='action'
          icon='Plus'
          onClick={attractionProductCreate.onOpen}
        >
          {t('attraction.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!attractionProducts.isPending &&
          attractionProducts.data.length === 0 && (
            <div className='flex justify-center py-4'>
              <span className='text-dav-ys-grey text-sm leading-4.5'>
                {t('attraction.empty-message')}
              </span>
            </div>
          )}
        {attractionProducts.isPending && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {attractionProducts.data.map((attractionProduct) => {
          return (
            <AttractionProductItem
              key={attractionProduct.id}
              attractionProduct={attractionProduct}
              onEdit={handleEdit}
              onItinerary={handleItinerary}
              onAskedQuestions={handleAskedQuestions}
              onRefresh={attractionProducts.onRefresh}
            />
          )
        })}
      </div>
      <Pagination
        limit={attractionProducts.limit}
        offset={attractionProducts.offset}
        total={attractionProducts.total}
        onOffset={attractionProducts.onOffset}
      />
    </div>
  )
}
