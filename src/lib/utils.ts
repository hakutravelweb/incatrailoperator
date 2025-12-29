import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Locale } from '@/i18n/config'
import { SLUG_REGEX } from './constants'

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export function verifyOpenedModals() {
  const dialogs = document.querySelectorAll('[role="dialog"]')
  if (dialogs.length === 0) {
    document.body.classList.remove('overflow-hidden', 'touch-none')
  }
}

export function isSlug(value: string): boolean {
  return SLUG_REGEX.test(value)
}

export function getFullMediaUrl(path: string): string {
  return `${process.env.STORAGE_API_URL}/media/${path}`
}

export function formatPrice(locale: Locale, price: number) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function generateTimes() {
  const times: string[] = []

  Array.from({ length: 24 }, (_, hours) => {
    Array.from({ length: 4 }, (_, quarter) => {
      const hour = String(hours).padStart(2, '0')
      const minutes = quarter * 15
      const minute = String(minutes).padStart(2, '0')
      const time = `${hour}:${minute}`
      times.push(time)
    })
  })

  return times
}
