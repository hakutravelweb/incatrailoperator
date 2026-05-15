import { Locale } from '@/i18n/config'

export interface Localization {
  locale: Locale
  slug: string
}

export interface Translation {
  es: string
  en: string
}

export interface TranslationMultiple {
  es: string[]
  en: string[]
}

export interface Navigation {
  id: string
  title: string
}
