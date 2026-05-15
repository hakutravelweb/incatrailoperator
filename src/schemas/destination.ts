import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translationSchema, translationDefaultValues } from '@/shared/schemas'

const destinationSchema = z.object({
  slug: translationSchema,
  title: translationSchema,
  department: translationSchema,
  about: translationSchema,
})

export type DestinationSchema = z.infer<typeof destinationSchema>

export const destinationResolver = zodResolver(destinationSchema)

export const destinationDefaultValues: DestinationSchema = {
  slug: translationDefaultValues,
  title: translationDefaultValues,
  department: translationDefaultValues,
  about: translationDefaultValues,
}
