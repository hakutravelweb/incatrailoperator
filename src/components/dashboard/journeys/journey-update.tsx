'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { variants, guidedLanguages } from '@/lib/constants'
import { JourneySchema, journeyResolver } from '@/schemas/journey'
import { updateJourney, getJourney } from '@/services/journey'
import { useCategories } from '@/hooks/use-categories'
import { useDestinations } from '@/hooks/use-destinations'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Select, SelectMultiple } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { InputTranslation } from '@/components/ui/input-translation'
import { TextareaTranslation } from '@/components/ui/textarea-translation'
import { InputListTranslation } from '@/components/ui/input-list-translation'
import { InputNumber } from '@/components/ui/input-number'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { UploadPhotos } from '@/components/ui/upload-photos'
import { SelectInputDuration } from '@/components/ui/select-input-duration'
import { EditorTranslation } from '@/components/ui/editor-translation'
import { UploadPdf } from '@/components/ui/upload-pdf'

interface Props {
  journeyId: string
  onClose: () => void
  onRefresh: () => void
}

export function JourneyUpdate({ journeyId, onClose, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const form = useForm<JourneySchema>({
    mode: 'all',
    resolver: journeyResolver,
    defaultValues: async (): Promise<JourneySchema> => {
      const journey = await getJourney(journeyId)

      return {
        variant: journey.variant,
        slug: journey.slug,
        photos: [],
        previewPhotos: journey.photos,
        deletedPhotos: [],
        title: journey.title,
        duration: journey.duration,
        about: journey.about,
        labels: journey.labels,
        cancellationPolicy: journey.cancellationPolicy,
        guidedLanguages: journey.guidedLanguages,
        pickUpService: journey.pickUpService,
        startTime: journey.startTime,
        finishTime: journey.finishTime,
        highlights: journey.highlights,
        detailedDescription: journey.detailedDescription,
        importantNote: journey.importantNote,
        inclusions: journey.inclusions,
        exclusions: journey.exclusions,
        importantWarning: journey.importantWarning,
        recommendations: journey.recommendations,
        additionalAdvice: journey.additionalAdvice,
        freeCancellation: journey.freeCancellation,
        refundable: journey.refundable,
        photoMap: null,
        previewPhotoMap: journey.photoMap,
        videoUrl: journey.videoUrl,
        pdfItinerary: null,
        previewPdfItinerary: journey.pdfItinerary,
        codeWetravel: journey.codeWetravel,
        retailPrice: journey.retailPrice,
        specialPrice: journey.specialPrice,
        categoryId: journey.categoryId,
        destinationId: journey.destinationId,
      }
    },
  })
  const { isDirty, isValid } = form.formState

  const categories = useCategories()
  const destinations = useDestinations()

  const handleDeletePhotos = (photos: string[]) => {
    form.setValue('deletedPhotos', photos)
  }

  const handleUpdate = async (data: JourneySchema) => {
    try {
      const { title } = await updateJourney(journeyId, data)
      toast.success(
        t('journey.updated-message', {
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
          {t('journey.update-label')}
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
            <InputTranslation
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
            <InputTranslation
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
              previewPhotos={form.watch('previewPhotos')}
              onDeletePhotos={handleDeletePhotos}
              deletedPhotos={form.watch('deletedPhotos')}
            />
          )}
        />
        <Controller
          control={form.control}
          name='about'
          render={({ field, formState }) => (
            <TextareaTranslation
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
            <InputListTranslation
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
            <EditorTranslation
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
            <TextareaTranslation
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
            <InputTranslation
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
            <InputTranslation
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
            <InputListTranslation
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
            <EditorTranslation
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
            <EditorTranslation
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
            <InputListTranslation
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
            <InputListTranslation
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
            <TextareaTranslation
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
            <InputListTranslation
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
            <TextareaTranslation
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
              previewPhoto={form.watch('previewPhotoMap')}
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
              previewPdf={form.watch('previewPdfItinerary')}
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
