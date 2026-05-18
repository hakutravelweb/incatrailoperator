'use client'
import { useState, ChangeEvent, useRef, useEffect } from 'react'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'

interface Props {
  ref?: RefCallBack
  variant?: 'standard'
  label?: string
  type?: 'text' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  isFocus?: boolean
}

export function Input({
  ref,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder,
  invalid,
  isFocus,
}: Props) {
  const focus = useDisclosure()
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useEffect(() => {
    if (focus.isOpen || isFocus) {
      inputRef.current?.focus()
    }
  }, [focus.isOpen, isFocus])

  useOnClickOutside({
    ref: contentRef,
    handler: focus.onClose,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    onChange(text)
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
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
        <input
          ref={(el) => {
            inputRef.current = el
            ref?.(el)
          }}
          type={type === 'password' && showPassword ? 'text' : type}
          className='placeholder:text-pewter-metallic w-full text-base leading-5.5 outline-hidden'
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
      {type === 'password' && (
        <button
          onClick={handleTogglePassword}
          className='hover:text-camouflage-blue cursor-pointer transition-colors duration-200'
        >
          {showPassword ? (
            <Icons.EyeOpen className='size-5' />
          ) : (
            <Icons.EyeHidden className='size-5' />
          )}
        </button>
      )}
    </div>
  )
}
