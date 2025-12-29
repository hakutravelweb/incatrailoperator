import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translateSchema, translateDefaultValues } from './root'

const destinationSchema = z.object({
  title: translateSchema,
  department: translateSchema,
  about: translateSchema,
})

export type DestinationSchema = z.infer<typeof destinationSchema>

export const destinationResolver = zodResolver(destinationSchema)

export const destinationDefaultValues: DestinationSchema = {
  title: translateDefaultValues,
  department: translateDefaultValues,
  about: translateDefaultValues,
}
