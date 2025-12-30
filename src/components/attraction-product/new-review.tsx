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
import { AttractionProduct } from '@/interfaces/attraction-product'
import { createReview } from '@/services/review'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { RateExperience } from '@/components/ui/rate-experience'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  attractionProduct: AttractionProduct
}

export function NewReview({ attractionProduct }: Props) {
  const locale = useLocale()
  const t = useTranslations('AttractionProduct')
  const router = useRouter()
  const form = useForm<ReviewSchema>({
    mode: 'all',
    resolver: reviewResolver,
    defaultValues: {
      ...reviewDefaultValues,
      locale,
      attractionProductId: attractionProduct.id,
    },
  })

  const handleClose = () => {
    router.push(`/attraction-product/${attractionProduct.slug}`)
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
      <div className='border-b-chinese-white z-overlay sticky top-0 flex flex-col justify-between gap-4 border-b bg-white py-2 md:flex-row'>
        <button
          onClick={handleClose}
          className='bg-anti-flash-white active:bg-chinese-white flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-100'
        >
          <Icons.Left className='size-6' />
        </button>
        <Button
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
        <div className='flex flex-col gap-2 border-l-2 border-l-black pl-4'>
          <strong className='text-base leading-4.75'>
            {t('review.traveller')}
          </strong>
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
