import { Locale } from '@/i18n/config'
import { DurationType } from '@/generated/prisma/enums'
import { Localization } from './root'

export interface AttractionProduct {
  id: string
  slug: string
  photos: string[]
  title: string
  duration: Duration
  about: string
  labels: string[]
  guideLanguages: string
  pickUpService: string
  startTime: string
  finishTime: string
  highlights: string[]
  detailedDescription: string
  importantNote: string
  includes: string[]
  notIncluded: string[]
  importantWarning: string
  recommendations: string[]
  additionalAdvice: string
  freeCancellation: Duration
  refundable: Duration
  attractionMap: string
  attractionVideo: string
  attractionPdf: string
  codeWetravel: string
  retailPrice: number
  specialPrice: number
  category: Category
  destination: Destination
  routes: Route[]
  askedQuestions: AskedQuestion[]
  reviews: Review[]
  rating: number
  reviewsCount: number
  localizations: Localization[]
}

export interface Route {
  id: string
  title: string
  waypoints: Waypoint[]
}

export interface Waypoint {
  id: string
  time: string
  title: string
  description: string
}

export interface Duration {
  type: DurationType
  quantity: number
}

export interface Category {
  id: string
  title: string
  attractionProductsCount: number
}

export interface Destination {
  id: string
  slug: string
  title: string
  department: string
  about: string
  attractionProductsCount: number
  photo: string
  rating: number
  travellersCount: number
  lowestPrice: number
  localizations: Localization[]
}

export interface AskedQuestion {
  id: string
  title: string
  description: string
}

export interface Review {
  id: string
  rating: number
  traveller: Traveller
  comment: string
}

export interface Traveller {
  fullname: string
  email: string
  country: string
}

export type AttractionView =
  | 'CREATE'
  | 'EDIT'
  | 'ITINERARY'
  | 'FAQ'
  | 'ATTRACTIONS'

export type DestinationView = 'CREATE' | 'EDIT' | 'DESTINATIONS'
export type CategoryView = 'CREATE' | 'EDIT' | 'CATEGORIES'

export interface Filters {
  locale: Locale
  destinationId: string
  search: string
  categoriesId: string[]
  rangePrice: RangePrice
  ratings: number[]
}

export interface RangePrice {
  from: number
  to: number
}
