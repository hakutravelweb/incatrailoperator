'use client'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import {
  FiltersAttractionProductsSchema,
  filtersAttractionProductsResolver,
  filtersAttractionProductsDefaultValues,
} from '@/schemas/root'
import { useCategories } from '@/hooks/use-categories'
import { useAttractionProducts } from '@/hooks/use-attraction-products'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { AttractionProductCard } from './attraction-product-card'

export function FiltersAttractionProducts() {
  const t = useTranslations('FiltersAttractionProducts')
  const form = useForm<FiltersAttractionProductsSchema>({
    mode: 'all',
    resolver: filtersAttractionProductsResolver,
    defaultValues: filtersAttractionProductsDefaultValues,
  })

  const categories = useCategories()
  const attractionProducts = useAttractionProducts()

  const handleFilters = (data: FiltersAttractionProductsSchema) => {
    if (data.search.length > 0) {
      attractionProducts.onSearch(data.search)
    }
    if (data.category) {
      attractionProducts.onCategory(data.category)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='shadow-deep z-overlay relative -mt-10 grid grid-cols-1 items-end gap-4 rounded-xl bg-white p-6 md:mx-auto md:w-max md:grid-cols-[1fr_1fr_auto]'>
        <Controller
          control={form.control}
          name='search'
          render={({ field, fieldState }) => (
            <Input
              variant='standard'
              label={t('destination-label')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('destination-search-placeholder')}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='category'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('category-label')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('select-category')}
              invalid={fieldState.invalid}
              emptyMessage={
                categories.data.length === 0
                  ? t('categories-empty-message')
                  : ''
              }
            >
              {categories.data.map((category) => {
                return (
                  <Select.Option key={category.id} value={category.id}>
                    {category.title}
                  </Select.Option>
                )
              })}
            </Select>
          )}
        />
        <Button onClick={form.handleSubmit(handleFilters)}>
          {t('search-label')}
        </Button>
      </div>
      {!attractionProducts.isPending &&
        attractionProducts.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('empty-message')}
            </span>
          </div>
        )}
      {attractionProducts.isPending && (
        <div className='flex justify-center py-2'>
          <Icons.Loading className='size-6' />
        </div>
      )}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {attractionProducts.data.map((attractionProduct) => {
          return (
            <AttractionProductCard
              key={attractionProduct.id}
              attractionProduct={attractionProduct}
            />
          )
        })}
      </div>
    </div>
  )
}
