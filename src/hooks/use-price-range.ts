import { useState, useRef, MouseEvent } from 'react'
import { PriceRange } from '@/interfaces/journey'

interface Props {
  min: number
  max: number
  value: PriceRange
  onChange: (value: PriceRange) => void
}

export function usePriceRange({ min, max, value, onChange }: Props) {
  const rangeRef = useRef<HTMLDivElement>(null)
  const minRef = useRef<HTMLDivElement>(null)
  const maxRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const [minPrice, setMinPrice] = useState<number>(value.min)
  const [maxPrice, setMaxPrice] = useState<number>(value.max)

  const handleMouseDown = (type: 'min' | 'max') => () => {
    setIsDragging(type)
  }

  const handleMouseUp = () => {
    setIsDragging(null)
    onChange({ min: minPrice, max: maxPrice })
  }

  const handleMouseLeave = () => {
    setIsDragging(null)
  }

  const handlePrice = (event: MouseEvent<HTMLDivElement>) => {
    const rect = rangeRef.current?.getBoundingClientRect()
    const left = rect?.left ?? 0
    const x = event.clientX - left
    const width = rect?.width ?? 0
    const price = Math.round(
      Math.max(min, Math.min((x / width) * (max - min) + min, max)),
    )
    if (price < (minPrice + maxPrice) / 2) {
      setMinPrice(Math.min(price, maxPrice - 5))
    } else {
      setMaxPrice(Math.max(price, minPrice + 5))
    }
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handlePrice(event)
    }
  }

  return {
    rangeRef,
    minRef,
    maxRef,
    minPrice,
    maxPrice,
    progress: {
      left: Math.round(((minPrice - min) / (max - min)) * 100),
      width: Math.round(((maxPrice - minPrice) / (max - min)) * 100),
    },
    sliderLeft: Math.round(((minPrice - min) / (max - min)) * 100),
    sliderRight: Math.round(((maxPrice - min) / (max - min)) * 100),
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onPrice: handlePrice,
  }
}
