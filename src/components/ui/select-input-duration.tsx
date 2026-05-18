'use client'
import { useEffect, useState, ChangeEvent, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { RefCallBack } from 'react-hook-form'
import { DurationType } from '@/generated/prisma/enums'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { durationTypes } from '@/lib/constants'
import { Duration } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'
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
  const hover = useDisclosure()
  const selectRef = useRef<HTMLDivElement>(null)
  const [price, setPrice] = useState<string>('')

  useOnClickOutside({
    ref: selectRef,
    handler: hover.onClose,
  })

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
    <div
      ref={selectRef}
      onClick={hover.onOpen}
      className={cn(
        'border-pewter-metallic flex h-14 items-center rounded-lg border-2 bg-white p-3',
        {
          'border-blue-fire': hover.isOpen,
          'border-cayenne-red': invalid,
        },
      )}
    >
      <div className='flex flex-1 flex-col'>
        <label
          className={cn('text-nevada pointer-events-none text-xs leading-4', {
            'text-blue-fire': hover.isOpen,
            'text-cayenne-red': invalid,
          })}
        >
          {label}
        </label>
        <div className='flex items-center gap-2'>
          <Dropdown>
            <Dropdown.Trigger>
              <div className='hover:bg-faded-white bg-bright-grey flex items-center gap-1 rounded-full px-2 py-1'>
                <Icons.Clock className='size-4' />
                <span className='text-sm leading-4.5'>
                  {t(`duration.${value.type}`)}
                </span>
              </div>
            </Dropdown.Trigger>
            <Dropdown.Content>
              {durationTypes.map((durationType) => {
                const active = durationType === value.type

                return (
                  <Dropdown.Option
                    key={durationType}
                    active={active}
                    onClick={handleClick(durationType)}
                  >
                    {t(`duration.${durationType}`)}
                  </Dropdown.Option>
                )
              })}
            </Dropdown.Content>
          </Dropdown>
          <input
            ref={ref}
            className='placeholder:text-pewter-metallic w-full text-base leading-5.5 font-medium outline-hidden'
            type='text'
            min={0}
            value={price}
            onChange={handleChange}
            placeholder='0'
          />
        </div>
      </div>
    </div>
  )
}
