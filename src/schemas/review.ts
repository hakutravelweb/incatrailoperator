import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const travellerSchema = z.object({
  fullname: z.string().min(1),
  email: z.string().min(1),
  country: z.string().min(1),
})

const reviewSchema = z.object({
  rating: z.number().min(1),
  traveller: travellerSchema,
  comment: z.string().min(1),
  locale: z.string().min(1),
  attractionProductId: z.string().min(1),
})

export type ReviewSchema = z.infer<typeof reviewSchema>

export const reviewResolver = zodResolver(reviewSchema)

export const reviewDefaultValues: ReviewSchema = {
  rating: 0,
  traveller: {
    fullname: '',
    email: '',
    country: '',
  },
  comment: '',
  locale: '',
  attractionProductId: '',
}
