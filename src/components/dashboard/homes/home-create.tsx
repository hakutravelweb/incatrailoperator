'use client'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { locales } from '@/i18n/config'
import { HomeSchema, homeResolver, homeDefaultValues } from '@/schemas/home'
import { Navigation } from '@/shared/interfaces'
import { createHome } from '@/services/home'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Select } from '@/components/ui/select'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { Input } from '@/components/ui/input'
import { Editor } from '@/components/ui/editor'

interface Props {
  onClose: () => void
  onRefresh: () => void
}

export function HomeCreate({ onClose, onRefresh }: Props) {
  const t = useTranslations('Dashboard')
  const form = useForm<HomeSchema>({
    mode: 'all',
    resolver: homeResolver,
    defaultValues: homeDefaultValues,
  })

  const handleNavigationTerms = (navigation: Navigation[]) => {
    form.setValue('navigationTerms', navigation)
  }

  const handleNavigationPrivacy = (navigation: Navigation[]) => {
    form.setValue('navigationPrivacy', navigation)
  }

  const handleCreate = async (data: HomeSchema) => {
    try {
      const { title } = await createHome(data)
      toast.success(
        t('home.created-message', {
          title,
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
      <div className='z-overlay sticky top-0 flex flex-col justify-between gap-4 bg-white py-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <button
            onClick={onClose}
            className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
          >
            <Icons.Left className='size-5' />
          </button>
          <span className='text-lg leading-6 font-bold'>
            {t('home.new-label')}
          </span>
        </div>
        <Button
          widthFit
          disabled={form.formState.isSubmitting}
          onClick={form.handleSubmit(handleCreate)}
        >
          {t('home.create-label')}
        </Button>
      </div>
      <div className='flex max-w-2xl flex-col gap-4'>
        <Controller
          control={form.control}
          name='locale'
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              label={t('home.form-field.locale')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('home.form-field.select-locale')}
              invalid={fieldState.invalid}
            >
              {locales.map((locale) => {
                return (
                  <Select.Option key={locale} value={locale}>
                    {t(`home.language.${locale}`)}
                  </Select.Option>
                )
              })}
            </Select>
          )}
        />
        <Controller
          control={form.control}
          name='photo'
          render={({ field, fieldState }) => (
            <UploadPhoto
              ref={field.ref}
              label={t('home.form-field.photo')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='title'
          render={({ field, fieldState }) => (
            <Input
              ref={field.ref}
              label={t('home.form-field.title')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <Controller
          control={form.control}
          name='subtitle'
          render={({ field, fieldState }) => (
            <Input
              ref={field.ref}
              label={t('home.form-field.subtitle')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
          )}
        />
        <div className='bg-bright-grey/80 flex flex-col gap-1 rounded-lg p-4'>
          <label className='text-sm leading-4.5 font-medium'>
            {t('home.form-field.resource.title')}
          </label>
          <div className='flex flex-col gap-2'>
            <Controller
              control={form.control}
              name='resource.url'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('home.form-field.resource.url')}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              control={form.control}
              name='resource.text'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('home.form-field.resource.text')}
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
          name='termsAndConditions'
          render={({ field, fieldState }) => (
            <Editor
              ref={field.ref}
              label={t('home.form-field.terms-and-conditions')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              onNavigation={handleNavigationTerms}
            />
          )}
        />
        <Controller
          control={form.control}
          name='privacyPolicy'
          render={({ field, fieldState }) => (
            <Editor
              ref={field.ref}
              label={t('home.form-field.privacy-policy')}
              value={field.value}
              onChange={field.onChange}
              invalid={fieldState.invalid}
              onNavigation={handleNavigationPrivacy}
            />
          )}
        />
      </div>
    </div>
  )
}
