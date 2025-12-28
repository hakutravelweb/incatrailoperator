import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { Locale, locales } from '@/i18n/config'
import { TranslateMultiple } from '@/interfaces/root'
import { InputList } from './input-list'

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
  const handleChange = (locale: Locale) => (list: string[]) => {
    onChange({
      ...value,
      [locale]: list,
    })
  }

  return (
    <div className='flex flex-col gap-2 border-l-2 border-l-black pl-4'>
      <strong className='text-base leading-5.25'>{label}</strong>
      <div className='flex flex-col gap-4'>
        {locales.map((locale) => {
          return (
            <InputList
              key={locale}
              ref={ref}
              label={locale}
              value={value[locale]}
              onChange={handleChange(locale)}
              errors={errors?.[locale]}
              translate
              deleteText={deleteText}
              addListText={addListText}
            />
          )
        })}
      </div>
    </div>
  )
}
