import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translationSchema, translationDefaultValues } from '@/shared/schemas'

const categorySchema = z.object({
  title: translationSchema,
})

export type CategorySchema = z.infer<typeof categorySchema>

export const categoryResolver = zodResolver(categorySchema)

export const categoryDefaultValues: CategorySchema = {
  title: translationDefaultValues,
}
