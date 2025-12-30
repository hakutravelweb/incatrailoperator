'use client'
import { useEffect, useState, ChangeEvent } from 'react'
import { RangePrice } from '@/interfaces/attraction-product'

interface Props {
  prefix: string
  value: RangePrice
  onChange: (value: RangePrice) => void
}

export function RangeInputNumber({ prefix, value, onChange }: Props) {
  const [fromPrice, setFromPrice] = useState<string>('')
  const [toPrice, setToPrice] = useState<string>('')

  useEffect(() => {
    if (value.from > 0) {
      setFromPrice(String(value.from))
    } else {
      setFromPrice('')
    }
    if (value.to > 0) {
      setToPrice(String(value.to))
    } else {
      setToPrice('')
    }
  }, [value.from, value.to])

  const handleChangeFrom = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/
    const text = event.currentTarget.value
    if (regex.test(text) || text === '') {
      onChange({
        ...value,
        from: Number(text),
      })
    }
  }

  const handleChangeTo = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/
    const text = event.currentTarget.value
    if (regex.test(text) || text === '') {
      onChange({
        ...value,
        to: Number(text),
      })
    }
  }

  return (
    <div className='border-chinese-white flex gap-2 rounded-lg border-2 bg-white p-2 focus-within:border-black'>
      <span className='translate-x-0.5 -translate-y-px text-base leading-4.75 font-bold'>
        {prefix}
      </span>
      <div className='grid grid-cols-2 gap-4'>
        <input
          className='text-center text-base leading-4.75 font-bold outline-hidden'
          type='text'
          value={fromPrice}
          onChange={handleChangeFrom}
          placeholder='0'
        />
        <input
          className='text-center text-base leading-4.75 font-bold outline-hidden'
          type='text'
          value={toPrice}
          onChange={handleChangeTo}
          placeholder='2000'
        />
      </div>
    </div>
  )
}
