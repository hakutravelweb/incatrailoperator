'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { variants, guidedLanguages } from '@/lib/constants'
import {
  JourneySchema,
  journeyResolver,
  journeyDefaultValues,
} from '@/schemas/journey'
import { createJourney } from '@/services/journey'
import { useCategories } from '@/hooks/use-categories'
import { useDestinations } from '@/hooks/use-destinations'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Select, SelectMultiple } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { InputTranslate } from '@/components/ui/input-translate'
import { TextareaTranslate } from '@/components/ui/textarea-translate'
import { InputListTranslate } from '@/components/ui/input-list-translate'
import { InputNumber } from '@/components/ui/input-number'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { UploadPhotos } from '@/components/ui/upload-photos'
import { SelectInputDuration } from '@/components/ui/select-input-duration'
import { EditorTranslate } from '@/components/ui/editor-translate'
import { UploadPdf } from '@/components/ui/upload-pdf'

interface Props {
  onClose: () => void
  onRefresh: () => void
}

export function JourneyCreate({ onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<JourneySchema>({
    mode: 'all',
    resolver: journeyResolver,
    defaultValues: journeyDefaultValues,
  })

  const categories = useCategories()
  const destinations = useDestinations()

  const handleCreate = async (data: JourneySchema) => {
    try {
      const { title } = await createJourney(data)
      toast.success(
        t('journey.created-message', {
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
            {t('journey.new-label')}
          </strong>
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleCreate)}
        >
          {t('journey.create-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='variant'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('journey.form-field.variant')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('journey.form-field.select-option')}
              invalid={fieldState.invalid}
            >
              {variants.map((variant) => {
                return (
                  <Select.Option key={variant} value={variant}>
                    {t(`journey.variants.${variant}`)}
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
              label={t('journey.form-field.slug')}
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
              label={t('journey.form-field.title')}
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
              label={t('journey.form-field.duration')}
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
              label={t('journey.form-field.photos')}
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
              label={t('journey.form-field.about')}
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
              label={t('journey.form-field.labels')}
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
            <EditorTranslate
              ref={field.ref}
              label={t('journey.form-field.cancellation-policy')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='guidedLanguages'
          render={({ field, fieldState }) => (
            <SelectMultiple
              ref={field.ref}
              label={t('journey.form-field.guide-languages')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('journey.form-field.select-options')}
              invalid={fieldState.invalid}
            >
              {guidedLanguages.map((guidedLanguage) => {
                return (
                  <Select.Option key={guidedLanguage} value={guidedLanguage}>
                    {t(`home.language.${guidedLanguage}`)}
                  </Select.Option>
                )
              })}
            </SelectMultiple>
          )}
        />
        <Controller
          control={form.control}
          name='pickUpService'
          render={({ field, formState }) => (
            <TextareaTranslate
              ref={field.ref}
              label={t('journey.form-field.pick-up-service')}
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
              label={t('journey.form-field.start-time')}
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
              label={t('journey.form-field.finish-time')}
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
              label={t('journey.form-field.highlights')}
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
            <EditorTranslate
              ref={field.ref}
              label={t('journey.form-field.detailed-description')}
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
            <EditorTranslate
              ref={field.ref}
              label={t('journey.form-field.important-note')}
              value={field.value}
              onChange={field.onChange}
              errors={formState.errors[field.name]}
            />
          )}
        />
        <Controller
          control={form.control}
          name='inclusions'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('journey.form-field.includes')}
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
          name='exclusions'
          render={({ field, formState }) => (
            <InputListTranslate
              ref={field.ref}
              label={t('journey.form-field.not-included')}
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
              label={t('journey.form-field.important-warning')}
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
              label={t('journey.form-field.recommendations')}
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
              label={t('journey.form-field.additional-advice')}
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
              label={t('journey.form-field.free-cancellation')}
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
              label={t('journey.form-field.refundable')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='photoMap'
          render={({ field, fieldState }) => (
            <UploadPhoto
              ref={field.ref}
              label={t('journey.form-field.journey-map')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='videoUrl'
          render={({ field, fieldState }) => (
            <Input
              ref={field.ref}
              label={t('journey.form-field.journey-video')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='pdfItinerary'
          render={({ field, fieldState }) => (
            <UploadPdf
              ref={field.ref}
              label={t('journey.form-field.journey-pdf')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='codeWetravel'
          render={({ field, fieldState }) => (
            <Input
              ref={field.ref}
              label={t('journey.form-field.code-wetravel')}
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
                label={t('journey.form-field.retail-price')}
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
                label={t('journey.form-field.special-price')}
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
              label={t('journey.form-field.category')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('journey.form-field.select-category')}
              invalid={fieldState.invalid}
              emptyMessage={t('category.empty-message')}
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
              label={t('journey.form-field.destination')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('journey.form-field.select-destination')}
              invalid={fieldState.invalid}
              emptyMessage={t('destination.empty-message')}
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
