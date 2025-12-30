import { Locale } from '@/i18n/config'

export {}
declare global {
  namespace PrismaJson {
    type Translate = {
      [key in Locale]: string
    }
    type TranslateMultiple = {
      [key in Locale]: string[]
    }
    type Duration = {
      type: 'DAY' | 'HOUR'
      quantity: number
    }
    type Traveller = {
      fullname: string
      email: string
      country: string
    }
    type Navigation = {
      id: string
      title: string
    }
    type Link = {
      href: string
      label: string
    }
  }
}
