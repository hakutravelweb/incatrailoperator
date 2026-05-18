'use client'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import {
  FiltersAttractionProductsSchema,
  filtersAttractionProductsResolver,
  filtersAttractionProductsDefaultValues,
} from '@/shared/schemas'
import { useCategories } from '@/hooks/use-categories'
import { useJourneys } from '@/hooks/use-journeys'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { JourneyCard } from './journey-card'

export function FiltersJourneys() {
  const t = useTranslations('FiltersJourneys')
  const form = useForm<FiltersAttractionProductsSchema>({
    mode: 'all',
    resolver: filtersAttractionProductsResolver,
    defaultValues: filtersAttractionProductsDefaultValues,
  })

  const categories = useCategories()
  const journeys = useJourneys()

  const handleFilters = (data: FiltersAttractionProductsSchema) => {
    if (data.search.length > 0) {
      journeys.onSearch(data.search)
    }
    if (data.category) {
      journeys.onCategory(data.category)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='shadow-main-small z-overlay relative -mt-10 grid grid-cols-1 items-end gap-4 rounded-2xl bg-white p-6 md:mx-auto md:w-max md:grid-cols-[1fr_1fr_auto]'>
        <Controller
          control={form.control}
          name='search'
          render={({ field, fieldState }) => (
            <Input
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
              emptyMessage={t('categories-empty-message')}
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
      {!journeys.loading && journeys.data.length === 0 && (
        <div className='flex justify-center py-4'>
          <span className='text-nevada text-sm leading-4.5'>
            {t('empty-message')}
          </span>
        </div>
      )}
      {journeys.loading && (
        <div className='bg-bright-grey my-10 h-100 w-full' />
      )}
      <div className='grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {journeys.data.map((journey) => {
          return <JourneyCard key={journey.id} journey={journey} />
        })}
      </div>
    </div>
  )
}
