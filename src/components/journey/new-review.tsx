'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { useRouter } from '@/i18n/routing'
import {
  ReviewSchema,
  reviewResolver,
  reviewDefaultValues,
} from '@/schemas/review'
import { Journey } from '@/interfaces/journey'
import { createReview } from '@/services/review'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { RateExperience } from '@/components/ui/rate-experience'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  journey: Journey
}

export function NewReview({ journey }: Props) {
  const locale = useLocale()
  const t = useTranslations('Journey')
  const router = useRouter()
  const form = useForm<ReviewSchema>({
    mode: 'all',
    resolver: reviewResolver,
    defaultValues: {
      ...reviewDefaultValues,
      locale,
      journeyId: journey.id,
    },
  })

  const handleClose = () => {
    router.push(`/journey/${journey.slug}`)
  }

  const handleCreate = async (data: ReviewSchema) => {
    try {
      data.locale = locale
      const { traveller } = await createReview(data)
      toast.success(
        t('review.created-message', {
          fullname: traveller.fullname,
        }),
      )
      handleClose()
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='z-overlay sticky top-0 flex flex-col justify-between gap-4 bg-white py-2 md:flex-row'>
        <button
          onClick={handleClose}
          className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
        >
          <Icons.Left className='size-6' />
        </button>
        <Button
          widthFit
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleCreate)}
        >
          {t('review.create-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='rating'
          render={({ field, fieldState }) => (
            <RateExperience
              ref={field.ref}
              label={t('review.form-field.rating')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <div className='bg-bright-grey/80 flex flex-col gap-1 rounded-lg p-4'>
          <label className='text-sm leading-4.5 font-medium'>
            {t('review.traveller')}
          </label>
          <div className='flex flex-col gap-4'>
            <Controller
              control={form.control}
              name='traveller.fullname'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('review.form-field.fullname')}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              control={form.control}
              name='traveller.email'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('review.form-field.email')}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              control={form.control}
              name='traveller.country'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('review.form-field.country')}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
              )}
            />
          </div>
        </div>
        <Controller
          control={form.control}
          name='comment'
          render={({ field, fieldState }) => (
            <Textarea
              ref={field.ref}
              label={t('review.form-field.comment')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
      </div>
    </div>
  )
}
