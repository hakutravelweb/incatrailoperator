import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { Locale, locales } from '@/i18n/config'
import { Translate } from '@/interfaces/root'
import { Input } from './input'

interface Props {
  ref?: RefCallBack
  label: string
  value: Translate
  onChange: (value: Translate) => void
  errors?: Merge<FieldError, FieldErrorsImpl<Translate>>
}

export function InputTranslate({ ref, label, value, onChange, errors }: Props) {
  const handleChange = (locale: Locale, text: string) => {
    onChange({
      ...value,
      [locale]: text,
    })
  }

  return (
    <div className='flex flex-col gap-2 border-l-2 border-l-black pl-4'>
      <strong className='text-base leading-4.75'>{label}</strong>
      <div className='flex flex-col gap-4'>
        {locales.map((locale) => {
          return (
            <Input
              key={locale}
              ref={ref}
              label={locale}
              value={value[locale]}
              onChange={(value) => handleChange(locale, value)}
              invalid={!!errors?.[locale]?.message}
              translate
            />
          )
        })}
      </div>
    </div>
  )
}
