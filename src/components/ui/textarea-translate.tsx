import { useTranslations } from 'next-intl'
import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { Locale, locales } from '@/i18n/config'
import { Translate } from '@/interfaces/root'
import { Textarea } from './textarea'
import { Tabs, Tab } from './tabs'

interface Props {
  ref?: RefCallBack
  label: string
  value: Translate
  onChange: (value: Translate) => void
  errors?: Merge<FieldError, FieldErrorsImpl<Translate>>
}

export function TextareaTranslate({
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
      <strong className='text-base leading-4.75'>{label}</strong>
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
