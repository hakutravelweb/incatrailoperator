import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { translateSchema, translateDefaultValues } from '@/shared/schemas'

const askedQuestionSchema = z.object({
  askedQuestionId: z.string(),
  title: translateSchema,
  description: translateSchema,
  journeyId: z.string().min(1),
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
  journeyId: '',
}

export const askedQuestionsDefaultValues: AskedQuestionsSchema = {
  title: translateDefaultValues,
  askedQuestions: [askedQuestionDefaultValues],
}
