import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translateSchema, translateDefaultValues } from './root'

const askedQuestionSchema = z.object({
  askedQuestionId: z.string(),
  title: translateSchema,
  description: translateSchema,
  attractionProductId: z.string().min(1),
})

const askedQuestionsSchema = z.object({
  title: translateSchema,
  askedQuestions: z.array(askedQuestionSchema),
})

export type AskedQuestionSchema = z.infer<typeof askedQuestionSchema>
export type AskedQuestionsSchema = z.infer<typeof askedQuestionsSchema>

export const askedQuestionsResolver = zodResolver(askedQuestionsSchema)

export const askedQuestionDefaultValues: AskedQuestionSchema = {
  askedQuestionId: '',
  title: translateDefaultValues,
  description: translateDefaultValues,
  attractionProductId: '',
}

export const askedQuestionsDefaultValues: AskedQuestionsSchema = {
  title: translateDefaultValues,
  askedQuestions: [askedQuestionDefaultValues],
}
