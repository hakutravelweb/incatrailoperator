'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { VARIANTS } from '@/lib/constants'
import {
  AttractionProductSchema,
  attractionProductResolver,
  attractionProductDefaultValues,
} from '@/schemas/attraction-product'
import { createAttractionProduct } from '@/services/attraction-product'
import { useCategories } from '@/hooks/use-categories'
import { useDestinations } from '@/hooks/use-destinations'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { InputTranslate } from '@/components/ui/input-translate'
import { TextareaTranslate } from '@/components/ui/textarea-translate'
import { InputListTranslate } from '@/components/ui/input-list-translate'
import { InputNumber } from '@/components/ui/input-number'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { UploadPhotos } from '@/components/ui/upload-photos'
import { SelectInputDuration } from '@/components/ui/select-input-duration'

interface Props {
  onClose: () => void
  onRefresh: () => void
}

export function AttractionProductCreate({ onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<AttractionProductSchema>({
    mode: 'all',
    resolver: attractionProductResolver,
    defaultValues: attractionProductDefaultValues,
  })

  const categories = useCategories()
  const destinations = useDestinations()

  const handleCreate = async (data: AttractionProductSchema) => {
    try {
      const { title } = await createAttractionProduct(data)
      toast.success(
        t('attraction.created-message', {
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
            {t('attraction.new-label')}
          </strong>
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleCreate)}
        >
          {t('attraction.create-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='variant'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('attraction.form-field.variant')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('attraction.form-field.select-variant')}
              invalid={fieldState.invalid}
            >
              {VARIANTS.map((variant) => {
                return (
                  <Select.Option key={variant} value={variant}>
                    {t(`attraction.variants.${variant}`)}
                  </Select.Option>
                )
              })}
            </Select>
          )}
        />
        <Controller
          control={form.control}
          name='slug'
          render={({ field, formState }) => (
            <InputTranslate
              ref={field.ref}
              label={t('attraction.form-field.url')}
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
            <InputTranslate
              ref={field.ref}
              label={t('attraction.form-field.title')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='duration'
          render={({ field, fieldState }) => (
            <SelectInputDuration
              ref={field.ref}
              label={t('attraction.form-field.duration')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='photos'
          render={({ field, fieldState }) => (
            <UploadPhotos
              ref={field.ref}
              label={t('attraction.form-field.photos')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='about'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.about')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='labels'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('attraction.form-field.labels')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
              addListText={t('input-list.add-list')}
              deleteText={t('input-list.actions.delete')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='cancellationPolicy'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.cancellation-policy')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='guideLanguages'
          render={({ field, formState }) => (
            <InputTranslate
              ref={field.ref}
              label={t('attraction.form-field.guide-languages')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='pickUpService'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.pick-up-service')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='startTime'
          render={({ field, formState }) => (
            <InputTranslate
              ref={field.ref}
              label={t('attraction.form-field.start-time')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='finishTime'
          render={({ field, formState }) => (
            <InputTranslate
              ref={field.ref}
              label={t('attraction.form-field.finish-time')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='highlights'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('attraction.form-field.highlights')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
              addListText={t('input-list.add-list')}
              deleteText={t('input-list.actions.delete')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='detailedDescription'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.detailed-description')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='importantNote'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.important-note')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='includes'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('attraction.form-field.includes')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
              addListText={t('input-list.add-list')}
              deleteText={t('input-list.actions.delete')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='notIncluded'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('attraction.form-field.not-included')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
              addListText={t('input-list.add-list')}
              deleteText={t('input-list.actions.delete')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='importantWarning'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.important-warning')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='recommendations'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('attraction.form-field.recommendations')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
              addListText={t('input-list.add-list')}
              deleteText={t('input-list.actions.delete')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='additionalAdvice'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('attraction.form-field.additional-advice')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='freeCancellation'
          render={({ field, fieldState }) => (
            <SelectInputDuration
              ref={field.ref}
              label={t('attraction.form-field.free-cancellation')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='refundable'
          render={({ field, fieldState }) => (
            <SelectInputDuration
              ref={field.ref}
              label={t('attraction.form-field.refundable')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='attractionMap'
          render={({ field, fieldState }) => (
            <UploadPhoto
              ref={field.ref}
              label={t('attraction.form-field.attraction-map')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='attractionVideo'
          render={({ field, fieldState }) => (
            <Input
              ref={field.ref}
              label={t('attraction.form-field.attraction-video')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
          <Controller
            control={form.control}
            name='retailPrice'
            render={({ field, fieldState }) => (
              <InputNumber
                ref={field.ref}
                label={t('attraction.form-field.retail-price')}
                prefix='$'
                value={field.value}
                onChange={field.onChange}
                placeholder='0.00'
                invalid={fieldState.invalid}
              />
            )}
          />
          <Controller
            control={form.control}
            name='specialPrice'
            render={({ field, fieldState }) => (
              <InputNumber
                ref={field.ref}
                label={t('attraction.form-field.special-price')}
                prefix='$'
                value={field.value}
                onChange={field.onChange}
                placeholder='0.00'
                invalid={fieldState.invalid}
              />
            )}
          />
        </div>
        <Controller
          control={form.control}
          name='categoryId'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('attraction.form-field.category')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('attraction.form-field.select-category')}
              invalid={fieldState.invalid}
              emptyMessage={
                categories.data.length === 0 ? t('category.empty-message') : ''
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
        <Controller
          control={form.control}
          name='destinationId'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('attraction.form-field.destination')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('attraction.form-field.select-destination')}
              invalid={fieldState.invalid}
              emptyMessage={
                destinations.data.length === 0
                  ? t('destination.empty-message')
                  : ''
              }
            >
              {destinations.data.map((destination) => {
                return (
                  <Select.Option key={destination.id} value={destination.id}>
                    {destination.title}
                  </Select.Option>
                )
              })}
            </Select>
          )}
        />
      </div>
    </div>
  )
}
