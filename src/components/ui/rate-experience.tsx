'use client'
import { useState } from 'react'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type Score = 1 | 2 | 3 | 4 | 5

interface Props {
  ref?: RefCallBack
  label: string
  value: number
  onChange: (value: number) => void
  invalid?: boolean
}

export function RateExperience({
  ref,
  label,
  value,
  onChange,
  invalid,
}: Props) {
  const ratings = Array.from({ length: 5 }, (_, index) => index + 1)

  const t = useTranslations('Dashboard')
  const [score, setScore] = useState<number>(0)

  const handleMouseOver = (score: number) => () => {
    setScore(score)
  }

  const handleMouseLeave = () => {
    setScore(0)
  }

  const handleSelect = (score: number) => () => {
    onChange(score)
  }

  return (
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-5.5 font-medium'>{label}</label>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-px'>
          {ratings.map((rating) => {
            const active = score > 0 ? score >= rating : value >= rating

            return (
              <Icons.Star
                key={rating}
                onClick={handleSelect(rating)}
                onMouseOver={handleMouseOver(rating)}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  'text-bright-grey size-8 cursor-pointer transition-colors duration-100',
                  {
                    'text-cayenne-red': invalid,
                    'text-abstract-navy': active,
                  },
                )}
              />
            )
          })}
        </div>
        {(score || value) > 0 && (
          <span className='text-sm leading-4.5'>
            {t(`rating.${(score || value) as Score}`)}
          </span>
        )}
      </div>
    </div>
  )
}
