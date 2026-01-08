import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  translateSchema,
  translateMultipleSchema,
  translateDefaultValues,
  translateMultipleDefaultValues,
} from './root'
import { locales } from '@/i18n/config'
import { isSlug } from '@/lib/utils'
import { Variant, DurationType } from '@/generated/prisma/enums'

const durationSchema = z.object({
  type: z.enum(DurationType),
  quantity: z.number(),
})

const freeCancellationSchema = durationSchema.extend({
  quantity: z.number(),
})

const refundableSchema = durationSchema.extend({
  quantity: z.number(),
})

const attractionProductSchema = z
  .object({
    variant: z.enum(Variant),
    slug: translateSchema.superRefine((value, ctx) => {
      locales.forEach((locale) => {
        const isValid = isSlug(value[locale])
        if (!isValid) {
          ctx.addIssue({
            code: 'custom',
            message: '',
            path: [locale],
          })
        }
      })
    }),
    photos: z.array(z.file()),
    previewPhotos: z.array(z.string()),
    deletedPhotos: z.array(z.string()),
    title: translateSchema,
    duration: durationSchema,
    about: translateSchema,
    labels: translateMultipleSchema,
    cancellationPolicy: translateSchema,
    guideLanguages: translateSchema,
    pickUpService: translateSchema,
    startTime: translateSchema,
    finishTime: translateSchema,
    highlights: translateMultipleSchema,
    detailedDescription: translateSchema,
    importantNote: translateSchema,
    includes: translateMultipleSchema,
    notIncluded: translateMultipleSchema,
    importantWarning: translateSchema,
    recommendations: translateMultipleSchema,
    additionalAdvice: translateSchema,
    freeCancellation: freeCancellationSchema,
    refundable: refundableSchema,
    attractionMap: z.file().nullable(),
    previewAttractionMap: z.string(),
    attractionVideo: z.string(),
    attractionPdf: z.file().nullable(),
    codeWetravel: translateSchema.extend({
      es: z.string(),
      en: z.string(),
    }),
    previewAttractionPdf: z.string(),
    retailPrice: z.number().min(1),
    specialPrice: z.number(),
    categoryId: z.string().min(1),
    destinationId: z.string().min(1),
  })
  .superRefine((value, ctx) => {
    if (value.photos.length === 0 && value.previewPhotos.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '',
        path: ['photos'],
      })
    }
  })

export type AttractionProductSchema = z.infer<typeof attractionProductSchema>

export const attractionProductResolver = zodResolver(attractionProductSchema)

export const attractionProductDefaultValues: AttractionProductSchema = {
  variant: 'ATTRACTION',
  slug: translateDefaultValues,
  photos: [],
  previewPhotos: [],
  deletedPhotos: [],
  title: translateDefaultValues,
  duration: {
    type: 'HOUR',
    quantity: 0,
  },
  about: translateDefaultValues,
  labels: translateMultipleDefaultValues,
  cancellationPolicy: translateDefaultValues,
  guideLanguages: translateDefaultValues,
  pickUpService: translateDefaultValues,
  startTime: translateDefaultValues,
  finishTime: translateDefaultValues,
  highlights: translateMultipleDefaultValues,
  detailedDescription: translateDefaultValues,
  importantNote: translateDefaultValues,
  includes: translateMultipleDefaultValues,
  notIncluded: translateMultipleDefaultValues,
  importantWarning: translateDefaultValues,
  recommendations: translateMultipleDefaultValues,
  additionalAdvice: translateDefaultValues,
  freeCancellation: {
    type: 'HOUR',
    quantity: 0,
  },
  refundable: {
    type: 'HOUR',
    quantity: 0,
  },
  attractionMap: null,
  previewAttractionMap: '',
  attractionVideo: '',
  attractionPdf: null,
  previewAttractionPdf: '',
  codeWetravel: translateDefaultValues,
  retailPrice: 0,
  specialPrice: 0,
  categoryId: '',
  destinationId: '',
}

const waypointSchema = z.object({
  waypointId: z.string(),
  time: z.string().min(1),
  title: translateSchema,
  description: translateSchema,
  routeId: z.string(),
})

const routeSchema = z.object({
  routeId: z.string(),
  title: translateSchema,
  attractionProductId: z.string().min(1),
  waypoints: z.array(waypointSchema),
})

const itinerarySchema = z.object({
  title: translateSchema,
  routes: z.array(routeSchema),
})

export type WaypointSchema = z.infer<typeof waypointSchema>
export type RouteSchema = z.infer<typeof routeSchema>
export type ItinerarySchema = z.infer<typeof itinerarySchema>

export const itineraryResolver = zodResolver(itinerarySchema)

export const waypointDefaultValues: WaypointSchema = {
  waypointId: '',
  time: '',
  title: translateDefaultValues,
  description: translateDefaultValues,
  routeId: '',
}

export const routeDefaultValues: RouteSchema = {
  routeId: '',
  title: translateDefaultValues,
  attractionProductId: '',
  waypoints: [waypointDefaultValues],
}

export const itineraryDefaultValues: ItinerarySchema = {
  title: translateDefaultValues,
  routes: [routeDefaultValues],
}
