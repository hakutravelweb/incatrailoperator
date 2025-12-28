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
