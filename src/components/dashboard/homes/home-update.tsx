'use client'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { locales } from '@/i18n/config'
import { Navigation } from '@/interfaces/root'
import { HomeSchema, homeResolver } from '@/schemas/home'
import { updateHome, getHome } from '@/services/home'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Select } from '@/components/ui/select'
import { UploadPhoto } from '@/components/ui/upload-photo'
import { Input } from '@/components/ui/input'
import { Editor } from '@/components/ui/editor'

interface Props {
  homeId: string
  onClose: () => void
  onRefresh: () => void
}

export function HomeUpdate({ homeId, onClose, onRefresh }: Props) {
  const t = useTranslations('Dashboard')
  const form = useForm<HomeSchema>({
    mode: 'all',
    resolver: homeResolver,
    defaultValues: async (): Promise<HomeSchema> => {
      const home = await getHome(homeId)

      return {
        locale: home.locale,
        photo: null,
        previewPhoto: home.photo,
        title: home.title,
        subtitle: home.subtitle,
        link: home.link,
        navigationTerms: home.navigationTerms,
        termsAndConditions: home.termsAndConditions,
        navigationPrivacy: home.navigationPrivacy,
        privacyPolicy: home.privacyPolicy,
      }
    },
  })
  const { isDirty, isValid } = form.formState

  const handleNavigationTerms = (navigation: Navigation[]) => {
    form.setValue('navigationTerms', navigation)
  }

  const handleNavigationPrivacy = (navigation: Navigation[]) => {
    form.setValue('navigationPrivacy', navigation)
  }

  const handleUpdate = async (data: HomeSchema) => {
    try {
      const { title } = await updateHome(homeId, data)
      toast.success(
        t('home.updated-message', {
          title,
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
      <div className='border-b-chinese-white z-overlay sticky top-0 flex flex-col justify-between gap-4 border-b bg-white py-2 md:flex-row'>
        <div className='flex items-center gap-2'>
          <button
            onClick={onClose}
            className='bg-anti-flash-white active:bg-chinese-white flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-100'
          >
            <Icons.Left className='size-6' />
          </button>
          <strong className='text-lg leading-6'>{form.watch('title')}</strong>
        </div>
        <Button
          disabled={!isDirty || !isValid || form.formState.isSubmitting}
          onClick={form.handleSubmit(handleUpdate)}
        >
          {t('home.update-label')}
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
              previewPhoto={form.watch('previewPhoto')}
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
        <div className='flex flex-col gap-2 border-l-2 border-l-black pl-4'>
          <strong className='text-base leading-4.75'>
            {t('home.form-field.link.title')}
          </strong>
          <div className='flex flex-col gap-4'>
            <Controller
              control={form.control}
              name='link.href'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('home.form-field.link.href')}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
              )}
            />
            <Controller
              control={form.control}
              name='link.label'
              render={({ field, fieldState }) => (
                <Input
                  ref={field.ref}
                  label={t('home.form-field.link.label')}
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
              enabledNavigation
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
              enabledNavigation
            />
          )}
        />
      </div>
    </div>
  )
}
