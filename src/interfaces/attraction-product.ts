import { DurationType } from '@/generated/prisma/enums'

export interface AttractionProduct {
  id: string
  slug: string
  photos: string[]
  title: string
  duration: Duration
  about: string
  labels: string[]
  includes: string[]
  notIncluded: string[]
  recommendations: string[]
  freeCancellation: Duration
  retailPrice: number
  specialPrice: number
  category?: string
  routes?: Route[]
  rating?: number
  reviewsCount?: number
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
  productAttractionQuantity: number
}

export interface Destination {
  id: string
  title: string
  department: string
  about: string
  productAttractionQuantity: number
}

export type AttractionView =
  | 'CREATE'
  | 'EDIT'
  | 'ITINERARY'
  | 'FAQ'
  | 'ATTRACTIONS'

export type DestinationView = 'CREATE' | 'EDIT' | 'DESTINATIONS'
export type CategoryView = 'CREATE' | 'EDIT' | 'CATEGORIES'
