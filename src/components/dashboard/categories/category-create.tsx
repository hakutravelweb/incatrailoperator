'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import {
  CategorySchema,
  categoryResolver,
  categoryDefaultValues,
} from '@/schemas/category'
import { createCategory } from '@/services/category'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { InputTranslate } from '@/components/ui/input-translate'

interface Props {
  onClose: () => void
  onRefresh: () => void
}

export function CategoryCreate({ onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<CategorySchema>({
    mode: 'all',
    resolver: categoryResolver,
    defaultValues: categoryDefaultValues,
  })

  const handleCreate = async (data: CategorySchema) => {
    try {
      const { title } = await createCategory(data)
      toast.success(
        t('category.created-message', {
          title: title[locale],
        }),
      )
      onClose()
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='border-b-chinese-white z-overlay sticky top-0 flex flex-col justify-between gap-4 border-b bg-white py-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <button
            onClick={onClose}
            className='bg-anti-flash-white active:bg-chinese-white flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-100'
          >
            <Icons.Left className='size-6' />
          </button>
          <strong className='text-lg leading-6'>
            {t('category.new-label')}
          </strong>
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleCreate)}
        >
          {t('category.create-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='title'
          render={({ field, formState }) => (
            <InputTranslate
              ref={field.ref}
              label={t('category.form-field.title')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
      </div>
    </div>
  )
}
