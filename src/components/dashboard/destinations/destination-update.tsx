'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { DestinationSchema, destinationResolver } from '@/schemas/destination'
import { updateDestination, getDestination } from '@/services/destination'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'

interface Props {
  destinationId: string
  onClose: () => void
  onRefresh: () => void
}

export function DestinationUpdate({
  destinationId,
  onClose,
  onRefresh,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<DestinationSchema>({
    mode: 'all',
    resolver: destinationResolver,
    defaultValues: async (): Promise<DestinationSchema> => {
      const destination = await getDestination(destinationId)

      return {
        slug: destination.slug,
        title: destination.title,
        department: destination.department,
        about: destination.about,
      }
    },
  })
  const { isDirty, isValid } = form.formState

  const handleUpdate = async (data: DestinationSchema) => {
    try {
      const { title } = await updateDestination(destinationId, data)
      toast.success(
        t('destination.updated-message', {
          title: title[locale],
        }),
      )
      onClose()
      onRefresh()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('DUPLICATED_SLUG_ERROR_LOCALES')) {
          toast.error(error.message)
        }
      }
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
          {t('destination.update-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='slug'
          render={({ field, formState }) => (
            <InputTranslation
              ref={field.ref}
              label={t('destination.form-field.slug')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='title'
          render={({ field, formState }) => (
            <InputTranslation
              ref={field.ref}
              label={t('destination.form-field.title')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='department'
          render={({ field, formState }) => (
            <InputTranslation
              ref={field.ref}
              label={t('destination.form-field.department')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='about'
          render={({ field, formState }) => (
            <TextareaTranslation
              ref={field.ref}
              label={t('destination.form-field.about')}
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
