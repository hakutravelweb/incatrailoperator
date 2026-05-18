import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import {
  Merge,
  FieldError,
  FieldErrorsImpl,
  RefCallBack,
} from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Locale, locales } from '@/i18n/config'
import { Translation } from '@/shared/interfaces'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'
import { Editor } from './editor'
import { Tabs, Tab } from './tabs'

interface Props {
  ref?: RefCallBack
  label: string
  value: Translation
  onChange: (value: Translation) => void
  errors?: Merge<FieldError, FieldErrorsImpl<Translation>>
}

export function EditorTranslation({
  ref,
  label,
  value,
  onChange,
  errors,
}: Props) {
  const t = useTranslations('Language')
  const focus = useDisclosure()
  const contentRef = useRef<HTMLDivElement>(null)
  const invalid = locales.some((locale) => !!errors?.[locale]?.message)
  const tabError = locales.findIndex((locale) => !!errors?.[locale]?.message)

  useOnClickOutside({
    ref: contentRef,
    handler: focus.onClose,
  })

  const handleChange = (locale: Locale) => (text: string) => {
    onChange({
      ...value,
      [locale]: text,
    })
  }

  return (
    <div
      ref={contentRef}
      onClick={focus.onOpen}
      className={cn(
        'border-pewter-metallic flex cursor-text items-center gap-2 rounded-lg border-2 bg-white p-3',
        {
          'border-blue-fire': focus.isOpen,
          'border-cayenne-red': invalid,
        },
      )}
    >
      <div className='flex flex-1 flex-col'>
        <label
          className={cn('text-nevada pointer-events-none text-xs leading-4', {
            'text-blue-fire': focus.isOpen,
            'text-cayenne-red': invalid,
          })}
        >
          {label}
        </label>
        <Tabs variant='translation' tabError={tabError}>
          {locales.map((locale) => {
            return (
              <Tab key={locale} label={t(locale)}>
                <Editor
                  ref={ref}
                  value={value[locale]}
                  onChange={handleChange(locale)}
                  invalid={!!errors?.[locale]?.message}
                  isFocus={focus.isOpen}
                />
              </Tab>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
