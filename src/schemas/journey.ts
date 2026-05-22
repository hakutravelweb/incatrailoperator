import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  translationSchema,
  translationSchemaOptional,
  translationMultipleSchema,
  translationDefaultValues,
  translationMultipleDefaultValues,
} from '@/shared/schemas'
import { locales } from '@/i18n/config'
import { isSlug } from '@/lib/utils'
import { Variant, DurationType, Locale } from '@/generated/prisma/enums'

const durationSchema = z.object({
  type: z.enum(DurationType),
  quantity: z.number().min(1),
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
    slug: translationSchema.superRefine((value, ctx) => {
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
    title: translationSchema,
    duration: durationSchema,
    about: translationSchema,
    labels: translationMultipleSchema,
    cancellationPolicy: translationSchemaOptional,
    guidedLanguages: z.array(z.enum(Locale)),
    pickUpService: translationSchemaOptional,
    startTime: translationSchemaOptional,
    finishTime: translationSchemaOptional,
    highlights: translationMultipleSchema,
    detailedDescription: translationSchemaOptional,
    importantNote: translationSchemaOptional,
    inclusions: translationMultipleSchema,
    exclusions: translationMultipleSchema,
    importantWarning: translationSchemaOptional,
    recommendations: translationMultipleSchema,
    additionalAdvice: translationSchemaOptional,
    freeCancellation: freeCancellationSchema,
    refundable: refundableSchema,
    photoMap: z.file().nullable(),
    previewPhotoMap: z.string(),
    deletedPhotoMap: z.string(),
    videoUrl: z.string(),
    pdfItinerary: z.file().nullable(),
    previewPdfItinerary: z.string(),
    deletedPdfItinerary: z.string(),
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
  slug: translationDefaultValues,
  photos: [],
  previewPhotos: [],
  deletedPhotos: [],
  title: translationDefaultValues,
  duration: {
    type: 'HOUR',
    quantity: 0,
  },
  about: translationDefaultValues,
  labels: translationMultipleDefaultValues,
  cancellationPolicy: translationDefaultValues,
  guidedLanguages: [],
  pickUpService: translationDefaultValues,
  startTime: translationDefaultValues,
  finishTime: translationDefaultValues,
  highlights: translationMultipleDefaultValues,
  detailedDescription: translationDefaultValues,
  importantNote: translationDefaultValues,
  inclusions: translationMultipleDefaultValues,
  exclusions: translationMultipleDefaultValues,
  importantWarning: translationDefaultValues,
  recommendations: translationMultipleDefaultValues,
  additionalAdvice: translationDefaultValues,
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
  deletedPhotoMap: '',
  videoUrl: '',
  pdfItinerary: null,
  previewPdfItinerary: '',
  deletedPdfItinerary: '',
  codeWetravel: '',
  retailPrice: 0,
  specialPrice: 0,
  categoryId: '',
  destinationId: '',
}

const waypointSchema = z.object({
  time: z.string().min(1),
  title: translationSchema,
  description: translationSchema,
  routeId: z.string(),
})

const routeSchema = z.object({
  title: translationSchema,
  journeyId: z.string().min(1),
})

export type WaypointSchema = z.infer<typeof waypointSchema>

export type RouteSchema = z.infer<typeof routeSchema>

export const routeResolver = zodResolver(routeSchema)

export const waypointResolver = zodResolver(waypointSchema)

export const waypointDefaultValues: WaypointSchema = {
  time: '',
  title: translationDefaultValues,
  description: translationDefaultValues,
  routeId: '',
}

export const routeDefaultValues: RouteSchema = {
  title: translationDefaultValues,
  journeyId: '',
}
