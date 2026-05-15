import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translationSchema, translationDefaultValues } from '@/shared/schemas'

const askedQuestionSchema = z.object({
  title: translationSchema,
  description: translationSchema,
  journeyId: z.string().min(1),
})

export type AskedQuestionSchema = z.infer<typeof askedQuestionSchema>

export const askedQuestionResolver = zodResolver(askedQuestionSchema)

export const askedQuestionDefaultValues: AskedQuestionSchema = {
  title: translationDefaultValues,
  description: translationDefaultValues,
  journeyId: '',
}
