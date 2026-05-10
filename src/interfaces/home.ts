import { Locale } from '@/generated/prisma/enums'
import { Navigation } from '@/shared/interfaces'

export interface Home {
  id: string
  locale: Locale
  photo: string
  title: string
  subtitle: string
  resource: Resource
  navigationTerms: Navigation[]
  termsAndConditions: string
  navigationPrivacy: Navigation[]
  privacyPolicy: string
}

interface Resource {
  url: string
  text: string
}

export type HomeView = 'CREATE' | 'EDIT' | 'HOMES'
