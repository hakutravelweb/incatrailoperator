'use client'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import {
  FiltersAttractionProductsSchema,
  filtersAttractionProductsResolver,
  filtersAttractionProductsDefaultValues,
} from '@/schemas/root'
import { useCategories } from '@/hooks/use-categories'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'

export function FiltersAttractionProducts() {
  const t = useTranslations('FiltersAttractionProducts')
  const form = useForm<FiltersAttractionProductsSchema>({
    mode: 'all',
    resolver: filtersAttractionProductsResolver,
    defaultValues: filtersAttractionProductsDefaultValues,
  })

  const categories = useCategories()

  const handleFilters = (data: FiltersAttractionProductsSchema) => {}

  return (
    <div className='shadow-deep z-overlay relative mx-auto -mt-10 grid grid-cols-1 items-end gap-4 rounded-xl bg-white p-6 md:w-max md:grid-cols-[1fr_1fr_auto]'>
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
              categories.data.length === 0 ? t('categories-empty-message') : ''
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
  )
}
