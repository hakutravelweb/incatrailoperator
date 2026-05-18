'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { CategorySchema, categoryResolver } from '@/schemas/category'
import { updateCategory, getCategory } from '@/services/category'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { InputTranslation } from '@/components/ui/input-translation'

interface Props {
  categoryId: string
  onClose: () => void
  onRefresh: () => void
}

export function CategoryUpdate({ categoryId, onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<CategorySchema>({
    mode: 'all',
    resolver: categoryResolver,
    defaultValues: async (): Promise<CategorySchema> => {
      const category = await getCategory(categoryId)

      return {
        title: category.title,
      }
    },
  })
  const { isDirty, isValid } = form.formState

  const handleUpdate = async (data: CategorySchema) => {
    try {
      const { title } = await updateCategory(categoryId, data)
      toast.success(
        t('category.updated-message', {
          title: title[locale],
        }),
      )
      onClose()
      onRefresh()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  if (form.formState.isLoading) {
    return (
      <div className='flex justify-center py-2'>
        <Icons.Loading className='size-6' />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='z-overlay sticky top-0 flex flex-col justify-between gap-4 bg-white py-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <button
            onClick={onClose}
            className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
          >
            <Icons.Left className='size-5' />
          </button>
          <span className='text-lg leading-6 font-bold'>
            {form.watch(`title.${locale}`)}
          </span>
        </div>
        <Button
          widthFit
          disabled={!isDirty || !isValid || form.formState.isSubmitting}
          onClick={form.handleSubmit(handleUpdate)}
        >
          {t('category.update-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='title'
          render={({ field, formState }) => (
            <InputTranslation
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
