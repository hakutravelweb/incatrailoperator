'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { useCategoriesPagination } from '@/hooks/use-categories-pagination'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { CategoryItem } from './category-item'
import { CategoryCreate } from './category-create'
import { CategoryUpdate } from './category-update'

export function Categories() {
  const t = useTranslations('Dashboard')
  const categoryCreate = useDisclosure()
  const categoryUpdate = useDisclosure()
  const categories = useCategoriesPagination()
  const [categoryId, setCategoryId] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    categories.onSearch(text)
  }

  const handleEdit = (id: string) => {
    setCategoryId(id)
    categoryUpdate.onOpen()
  }

  if (categoryUpdate.isOpen) {
    return (
      <CategoryUpdate
        categoryId={categoryId}
        onClose={categoryUpdate.onClose}
        onRefresh={categories.onRefresh}
      />
    )
  }

  if (categoryCreate.isOpen) {
    return (
      <CategoryCreate
        onClose={categoryCreate.onClose}
        onRefresh={categories.onRefresh}
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
            value={categories.search}
            onChange={handleChange}
            placeholder={t('category.search-placeholder')}
          />
        </div>
        <Button variant='action' icon='Plus' onClick={categoryCreate.onOpen}>
          {t('category.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!categories.isPending && categories.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('category.empty-message')}
            </span>
          </div>
        )}
        {categories.isPending && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {categories.data.map((category) => {
          return (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onRefresh={categories.onRefresh}
            />
          )
        })}
      </div>
      <Pagination
        limit={categories.limit}
        offset={categories.offset}
        total={categories.total}
        onOffset={categories.onOffset}
      />
    </div>
  )
}
