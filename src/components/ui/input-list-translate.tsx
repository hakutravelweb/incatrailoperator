import { useTranslations } from 'next-intl'
import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { Locale, locales } from '@/i18n/config'
import { TranslateMultiple } from '@/shared/interfaces'
import { InputList } from './input-list'
import { Tabs, Tab } from './tabs'

interface Props {
  ref?: RefCallBack
  label: string
  value: TranslateMultiple
  onChange: (value: TranslateMultiple) => void
  errors?: Merge<FieldError, FieldErrorsImpl<TranslateMultiple>>
  deleteText: string
  addListText: string
}

export function InputListTranslate({
  ref,
  label,
  value,
  onChange,
  errors,
  deleteText,
  addListText,
}: Props) {
  const t = useTranslations('Language')
  const tabError = locales.findIndex((locale) => !!errors?.[locale]?.message)

  const handleChange = (locale: Locale) => (list: string[]) => {
    onChange({
      ...value,
      [locale]: list,
    })
  }

  return (
    <div className='border-l-anti-flash-white flex flex-col gap-2 border-l-3 pl-4'>
      <label className='text-base leading-5.25 font-medium'>{label}</label>
      <Tabs tabError={tabError}>
        {locales.map((locale) => {
          return (
            <Tab key={locale} label={t(locale)}>
              <InputList
                ref={ref}
                value={value[locale]}
                onChange={handleChange(locale)}
                errors={errors?.[locale]}
                deleteText={deleteText}
                addListText={addListText}
              />
            </Tab>
          )
        })}
      </Tabs>
    </div>
  )
}
