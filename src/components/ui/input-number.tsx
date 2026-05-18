'use client'
import { useEffect, useState, ChangeEvent, useRef } from 'react'
import { RefCallBack } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'

interface Props {
  ref?: RefCallBack
  label: string
  prefix: string
  value: number
  onChange: (value: number) => void
  placeholder: string
  invalid: boolean
}

export function InputNumber({
  ref,
  label,
  prefix,
  value,
  onChange,
  placeholder,
  invalid,
}: Props) {
  const focus = useDisclosure()
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [price, setPrice] = useState<string>('')

  useEffect(() => {
    if (focus.isOpen) {
      inputRef.current?.focus()
    }
  }, [focus.isOpen])

  useEffect(() => {
    if (value > 0) {
      setPrice(String(value))
    } else {
      setPrice('')
    }
  }, [value])

  useOnClickOutside({
    ref: contentRef,
    handler: focus.onClose,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/
    const text = event.currentTarget.value
    if (regex.test(text) || text === '') {
      onChange(Number(text))
    }
  }

  return (
    <div
      ref={contentRef}
      onClick={focus.onOpen}
      className={cn(
        'border-pewter-metallic flex h-14 cursor-text items-center gap-2 rounded-lg border-2 bg-white p-3',
        {
          'border-blue-fire': focus.isOpen,
          'border-cayenne-red': invalid,
          'h-auto rounded-none border-none p-0': !label,
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
        <div className='flex gap-1'>
          <span className='text-base leading-5.25 font-medium'>{prefix}</span>
          <input
            ref={(el) => {
              inputRef.current = el
              ref?.(el)
            }}
            className='placeholder:text-pewter-metallic w-full text-base leading-5.5 font-medium outline-hidden'
            type='text'
            min={0}
            value={price}
            onChange={handleChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  )
}
