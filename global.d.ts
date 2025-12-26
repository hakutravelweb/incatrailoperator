import { Locale } from '@/i18n/config'
import { formats } from '@/i18n/request'
import translations from './translations/es.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: typeof translations
    Formats: typeof formats
  }
}
