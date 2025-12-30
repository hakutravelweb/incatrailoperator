'use client'
import { useEffect, useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { RefCallBack } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { TYPES } from '@/lib/constants'
import { Duration } from '@/interfaces/attraction-product'
import { DurationType } from '@/generated/prisma/enums'
import { Dropdown } from './dropdown'

interface Props {
  ref?: RefCallBack
  label: string
  value: Duration
  onChange: (value: Duration) => void
  invalid: boolean
}

export function SelectInputDuration({
  ref,
  label,
  value,
  onChange,
  invalid,
}: Props) {
  const t = useTranslations('Dashboard')
  const [price, setPrice] = useState<string>('')

  useEffect(() => {
    if (value.quantity > 0) {
      setPrice(String(value.quantity))
    } else {
      setPrice('')
    }
  }, [value.quantity])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/
    const text = event.currentTarget.value
    if (regex.test(text) || text === '') {
      onChange({
        ...value,
        quantity: Number(text),
      })
    }
  }

  const handleClick = (type: DurationType) => () => {
    onChange({
      ...value,
      type,
    })
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
        <Dropdown>
          <Dropdown.Trigger>
            <div className='border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex items-center gap-1 rounded-full border-2 bg-white px-4 py-2'>
              <span className='text-base leading-4.75'>
                {t(`duration.${value.type}`)}
              </span>
            </div>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {TYPES.map((type) => {
              const active = type === value.type

              return (
                <Dropdown.Option
                  key={type}
                  active={active}
                  onClick={handleClick(type)}
                >
                  {t(`duration.${type}`)}
                </Dropdown.Option>
              )
            })}
          </Dropdown.Content>
        </Dropdown>
        <input
          ref={ref}
          className='flex-1 text-base leading-4.75 font-bold outline-hidden'
          type='text'
          min={0}
          value={price}
          onChange={handleChange}
          placeholder='0'
        />
      </div>
    </div>
  )
}
