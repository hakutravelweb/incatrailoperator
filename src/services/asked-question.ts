'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { AskedQuestionsSchema } from '@/schemas/asked-question'

export async function getAskedQuestions(journeyId: string) {
  const askedQuestions = await unstable_cache(
    async () => {
      return await prisma.askedQuestion.findMany({
        where: {
          journeyId,
        },
      })
    },
    [`asked-questions-${journeyId}`],
    { tags: ['asked-questions'] },
  )()

  return askedQuestions
}

export async function saveAskedQuestions(input: AskedQuestionsSchema) {
  await prisma.$transaction(
    async (transaction) => {
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
    },
    {
      timeout: 10000,
    },
  )

  revalidateTag('asked-questions', { expire: 0 })
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

  revalidateTag('asked-questions', { expire: 0 })
  return deleted
}
