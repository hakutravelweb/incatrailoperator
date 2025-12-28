'use client'
import { useEffect, useState, ChangeEvent } from 'react'
import { RefCallBack } from 'react-hook-form'
import { cn } from '@/lib/utils'

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
  const [price, setPrice] = useState<string>('')

  useEffect(() => {
    if (value > 0) {
      setPrice(String(value))
    } else {
      setPrice('')
    }
  }, [value])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/
    const text = event.currentTarget.value
    if (regex.test(text) || text === '') {
      onChange(Number(text))
    }
  }

  return (
    <div className='flex flex-col gap-px'>
      <label className='text-base leading-4.75 font-bold'>{label}</label>
      <div
        className={cn(
          'border-chinese-white flex gap-1.25 rounded-sm border-2 bg-white p-4 focus-within:border-black',
          {
            'border-ue-red': invalid,
          },
        )}
      >
        <span className='translate-x-0.5 -translate-y-px text-base leading-4.75 font-bold'>
          {prefix}
        </span>
        <input
          ref={ref}
          className='arrow-hidden flex-1 text-base leading-4.75 font-bold outline-hidden'
          type='number'
          min={0}
          value={price}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
