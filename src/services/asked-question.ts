'use server'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { AskedQuestionsSchema } from '@/schemas/asked-question'

export const getAskedQuestions = cache(async (attractionProductId: string) => {
  const askedQuestions = await prisma.askedQuestion.findMany({
    where: {
      attractionProductId,
    },
  })

  return askedQuestions
})

export async function saveAskedQuestions(input: AskedQuestionsSchema) {
  await prisma.$transaction(async (transaction) => {
    await Promise.all(
      input.askedQuestions.map(async (askedQuestion) => {
        const { askedQuestionId, ...data } = askedQuestion
        if (askedQuestionId) {
          await transaction.askedQuestion.update({
            data,
            where: {
              id: askedQuestionId,
            },
          })
        } else {
          await transaction.askedQuestion.create({
            data,
          })
        }
      }),
    )
  })
}

export async function deleteAskedQuestion(id: string) {
  const askedQuestion = await prisma.askedQuestion.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deleted = await prisma.askedQuestion.delete({
    where: {
      id: askedQuestion.id,
    },
  })

  return deleted
}
