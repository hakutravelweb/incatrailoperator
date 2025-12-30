'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { AttractionView } from '@/interfaces/attraction-product'
import { useAttractionProductsPagination } from '@/hooks/use-attraction-products-pagination'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { AttractionProductItem } from './attraction-product-item'
import { AttractionProductCreate } from './attraction-product-create'
import { AttractionProductUpdate } from './attraction-product-update'
import { AttractionProductItinerary } from './attraction-product-itinerary'
import { AttractionProductAskedQuestions } from './attraction-product-asked-questions'

export function AttractionProducts() {
  const t = useTranslations('Dashboard')
  const attractionProducts = useAttractionProductsPagination()
  const [attractionProductId, setAttractionProductId] = useState<string>('')
  const [attractionView, setAttractionView] =
    useState<AttractionView>('ATTRACTIONS')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    attractionProducts.onSearch(text)
  }

  const handleChangeView = (view: AttractionView) => (id?: string) => {
    if (id) {
      setAttractionProductId(id)
    }
    setAttractionView(view)
  }

  if (attractionView === 'FAQ') {
    return (
      <AttractionProductAskedQuestions
        attractionProductId={attractionProductId}
        onClose={handleChangeView('ATTRACTIONS')}
      />
    )
  }

  if (attractionView === 'ITINERARY') {
    return (
      <AttractionProductItinerary
        attractionProductId={attractionProductId}
        onClose={handleChangeView('ATTRACTIONS')}
      />
    )
  }

  if (attractionView === 'EDIT') {
    return (
      <AttractionProductUpdate
        attractionProductId={attractionProductId}
        onClose={handleChangeView('ATTRACTIONS')}
        onRefresh={attractionProducts.onRefresh}
      />
    )
  }

  if (attractionView === 'CREATE') {
    return (
      <AttractionProductCreate
        onClose={handleChangeView('ATTRACTIONS')}
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
          onClick={handleChangeView('CREATE')}
        >
          {t('attraction.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!attractionProducts.loading &&
          attractionProducts.data.length === 0 && (
            <div className='flex justify-center py-4'>
              <span className='text-dav-ys-grey text-sm leading-4.5'>
                {t('attraction.empty-message')}
              </span>
            </div>
          )}
        {attractionProducts.loading && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {attractionProducts.data.map((attractionProduct) => {
          return (
            <AttractionProductItem
              key={attractionProduct.id}
              attractionProduct={attractionProduct}
              onEdit={handleChangeView('EDIT')}
              onItinerary={handleChangeView('ITINERARY')}
              onAskedQuestions={handleChangeView('FAQ')}
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
