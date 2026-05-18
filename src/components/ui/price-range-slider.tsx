'use client'
import { useLocale } from 'next-intl'
import { formatPrice } from '@/lib/utils'
import { PriceRange } from '@/interfaces/journey'
import { usePriceRange } from '@/hooks/use-price-range'

interface Props {
  min: number
  max: number
  value: PriceRange
  onChange: (value: PriceRange) => void
}

export function PriceRangeSlider({ min, max, value, onChange }: Props) {
  const locale = useLocale()
  const {
    rangeRef,
    minRef,
    maxRef,
    minPrice,
    maxPrice,
    progress,
    sliderLeft,
    sliderRight,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onPrice,
  } = usePriceRange({
    min,
    max,
    value,
    onChange,
  })

  return (
    <div className='flex flex-col'>
      <span className='text-nevada text-sm leading-4.5'>
        {formatPrice(locale, minPrice)} - {formatPrice(locale, maxPrice)} +
      </span>
      <div
        ref={rangeRef}
        className='bg-faded-white relative mx-2.5 my-5 flex h-1.5 cursor-pointer items-center rounded-sm'
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClick={onPrice}
      >
        <div
          className='bg-abstract-navy absolute h-full'
          style={{
            left: `${progress.left}%`,
            width: `${progress.width}%`,
          }}
        />
        <div
          ref={minRef}
          className='border-abstract-navy absolute z-3 size-5 cursor-pointer rounded-sm border-2 bg-white'
          style={{
            left: `calc(${sliderLeft}% - 10px)`,
          }}
          onMouseDown={onMouseDown('min')}
        />
        <div
          ref={maxRef}
          className='border-abstract-navy absolute z-3 size-5 cursor-pointer rounded-sm border-2 bg-white'
          style={{
            left: `calc(${sliderRight}% - 10px)`,
          }}
          onMouseDown={onMouseDown('max')}
        />
      </div>
    </div>
  )
}
