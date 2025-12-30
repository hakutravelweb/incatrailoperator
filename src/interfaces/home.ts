import { Navigation } from './root'

export interface Home {
  id: string
  locale: string
  photo: string
  title: string
  subtitle: string
  link: Link
  navigationTerms: Navigation[]
  termsAndConditions: string
  navigationPrivacy: Navigation[]
  privacyPolicy: string
}

interface Link {
  href: string
  label: string
}

export type HomeView = 'CREATE' | 'EDIT' | 'HOMES'
