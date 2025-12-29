import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { Locale, locales } from '@/i18n/config'
import { Translate, Navigation } from '@/interfaces/root'
import { Editor } from './editor'

interface Props {
  ref?: RefCallBack
  label: string
  value: Translate
  onChange: (value: Translate) => void
  onNavigation?: (value: Navigation[]) => void
  enabledNavigation?: boolean
  errors?: Merge<FieldError, FieldErrorsImpl<Translate>>
}

export function EditorTranslate({
  ref,
  label,
  value,
  onChange,
  onNavigation,
  enabledNavigation,
  errors,
}: Props) {
  const handleChange = (locale: Locale) => (text: string) => {
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
            <Editor
              key={locale}
              ref={ref}
              label={locale}
              value={value[locale]}
              onChange={handleChange(locale)}
              invalid={!!errors?.[locale]?.message}
              translate
              onNavigation={onNavigation}
              enabledNavigation={enabledNavigation}
            />
          )
        })}
      </div>
    </div>
  )
}
