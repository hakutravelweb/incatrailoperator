import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translateSchema, translateDefaultValues } from './root'

const categorySchema = z.object({
  title: translateSchema,
})

export type CategorySchema = z.infer<typeof categorySchema>

export const categoryResolver = zodResolver(categorySchema)

export const categoryDefaultValues: CategorySchema = {
  title: translateDefaultValues,
}
