import { ChangeEvent, useEffect, useRef } from 'react'
import { RefCallBack } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'

interface Props {
  ref?: RefCallBack
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  isFocus?: boolean
}

export function Textarea({
  ref,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  isFocus,
}: Props) {
  const focus = useDisclosure()
  const contentRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (focus.isOpen || isFocus) {
      textareaRef.current?.focus()
    }
  }, [focus.isOpen, isFocus])

  useOnClickOutside({
    ref: contentRef,
    handler: focus.onClose,
  })

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    onChange(text)
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
          'rounded-none border-none p-0': !label,
        },
      )}
    >
      <div className='flex flex-1 flex-col'>
        {label && (
          <label
            className={cn('text-nevada pointer-events-none text-xs leading-4', {
              'text-blue-fire': focus.isOpen,
              'text-cayenne-red': invalid,
            })}
          >
            {label}
          </label>
        )}
        <textarea
          ref={(el) => {
            textareaRef.current = el
            ref?.(el)
          }}
          className='placeholder:text-pewter-metallic field-sizing-content min-h-25 w-full resize-none text-base leading-5.5 outline-hidden'
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
