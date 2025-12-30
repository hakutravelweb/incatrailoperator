import { Locale } from '@/i18n/config'

export interface Localization {
  locale: Locale
  slug: string
}

export interface Translate {
  es: string
  en: string
}

export interface TranslateMultiple {
  es: string[]
  en: string[]
}

export interface Navigation {
  id: string
  title: string
}

export type ObserverSelector = 'data-toc-id'
