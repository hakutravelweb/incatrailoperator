import { Locale } from '@/i18n/config'
import { DurationType, Variant } from '@/generated/prisma/enums'
import { Localization } from '@/shared/interfaces'
import { Review } from './review'

export interface Journey {
  id: string
  variant: Variant
  slug: string
  photos: string[]
  title: string
  duration: Duration
  about: string
  labels: string[]
  guidedLanguages: Locale[]
  pickUpService: string
  startTime: string
  finishTime: string
  highlights: string[]
  detailedDescription: string
  importantNote: string
  inclusions: string[]
  exclusions: string[]
  importantWarning: string
  recommendations: string[]
  additionalAdvice: string
  freeCancellation: Duration
  refundable: Duration
  photoMap: string
  videoUrl: string
  pdfItinerary: string
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
  journeysCount: number
}

export interface Destination {
  id: string
  slug: string
  title: string
  department: string
  about: string
  journeysCount: number
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

export type JourneyView =
  | 'CREATE'
  | 'EDIT'
  | 'ITINERARY'
  | 'FAQS'
  | 'JOURNEYS'
  | 'REVIEWS'

export type DestinationView = 'CREATE' | 'EDIT' | 'DESTINATIONS'
export type CategoryView = 'CREATE' | 'EDIT' | 'CATEGORIES'

export interface Filters {
  locale: Locale
  destinationId: string
  search: string
  categoriesId: string[]
  priceRange: PriceRange
  ratings: number[]
}

export interface PriceRange {
  min: number
  max: number
}
