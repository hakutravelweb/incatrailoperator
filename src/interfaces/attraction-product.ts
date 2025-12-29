import { DurationType } from '@/generated/prisma/enums'

export interface AttractionProduct {
  id: string
  slug: string
  photos: string[]
  title: string
  about: string
  labels: string[]
  includes: string[]
  notIncluded: string[]
  recommendations: string[]
  retailPrice: number
  specialPrice: number
  routes: Route[]
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
