import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  translateSchema,
  translateMultipleSchema,
  translateDefaultValues,
  translateMultipleDefaultValues,
} from '@/shared/schemas'
import { locales } from '@/i18n/config'
import { isSlug } from '@/lib/utils'
import { Variant, DurationType, Locale } from '@/generated/prisma/enums'

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

const journeySchema = z
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
    guidedLanguages: z.array(z.enum(Locale)),
    pickUpService: translateSchema,
    startTime: translateSchema,
    finishTime: translateSchema,
    highlights: translateMultipleSchema,
    detailedDescription: translateSchema,
    importantNote: translateSchema,
    inclusions: translateMultipleSchema,
    exclusions: translateMultipleSchema,
    importantWarning: translateSchema,
    recommendations: translateMultipleSchema,
    additionalAdvice: translateSchema,
    freeCancellation: freeCancellationSchema,
    refundable: refundableSchema,
    photoMap: z.file().nullable(),
    previewPhotoMap: z.string(),
    videoUrl: z.string(),
    pdfItinerary: z.file().nullable(),
    previewPdfItinerary: z.string(),
    codeWetravel: z.string(),
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

export type JourneySchema = z.infer<typeof journeySchema>

export const journeyResolver = zodResolver(journeySchema)

export const journeyDefaultValues: JourneySchema = {
  variant: 'JOURNEY',
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
  guidedLanguages: [],
  pickUpService: translateDefaultValues,
  startTime: translateDefaultValues,
  finishTime: translateDefaultValues,
  highlights: translateMultipleDefaultValues,
  detailedDescription: translateDefaultValues,
  importantNote: translateDefaultValues,
  inclusions: translateMultipleDefaultValues,
  exclusions: translateMultipleDefaultValues,
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
  photoMap: null,
  previewPhotoMap: '',
  videoUrl: '',
  pdfItinerary: null,
  previewPdfItinerary: '',
  codeWetravel: '',
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
  journeyId: z.string().min(1),
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
  journeyId: '',
  waypoints: [waypointDefaultValues],
}

export const itineraryDefaultValues: ItinerarySchema = {
  title: translateDefaultValues,
  routes: [routeDefaultValues],
}
