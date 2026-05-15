import { useTranslations } from 'next-intl'
import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { Locale, locales } from '@/i18n/config'
import { Translation } from '@/shared/interfaces'
import { Textarea } from './textarea'
import { Tabs, Tab } from './tabs'

interface Props {
  ref?: RefCallBack
  label: string
  value: Translation
  onChange: (value: Translation) => void
  errors?: Merge<FieldError, FieldErrorsImpl<Translation>>
}

export function TextareaTranslation({
  ref,
  label,
  value,
  onChange,
  errors,
}: Props) {
  const t = useTranslations('Language')
  const tabError = locales.findIndex((locale) => !!errors?.[locale]?.message)

  const handleChange = (locale: Locale) => (text: string) => {
    onChange({
      ...value,
      [locale]: text,
    })
  }

  return (
    <div className='border-l-anti-flash-white flex flex-col gap-2 border-l-3 pl-4'>
      <label className='text-base leading-5.25 font-medium'>{label}</label>
      <Tabs tabError={tabError}>
        {locales.map((locale) => {
          return (
            <Tab key={locale} label={t(locale)}>
              <Textarea
                ref={ref}
                value={value[locale]}
                onChange={handleChange(locale)}
                invalid={!!errors?.[locale]?.message}
              />
            </Tab>
          )
        })}
      </Tabs>
    </div>
  )
}
