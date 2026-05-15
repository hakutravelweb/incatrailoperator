'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Locale } from '@/generated/prisma/enums'
import { AskedQuestion } from '@/interfaces/journey'
import { AskedQuestionSchema } from '@/schemas/asked-question'

export async function getAskedQuestions(locale: Locale, journeyId: string) {
  const askedQuestions = await unstable_cache(
    async () => {
      return await prisma.askedQuestion.findMany({
        where: {
          journeyId,
        },
      })
    },
    [`asked-questions-${locale}-${journeyId}`],
    { tags: ['asked-questions'] },
  )()

  const askedQuestionsTranslation = askedQuestions.map(
    (askedQuestion): AskedQuestion => {
      return {
        ...askedQuestion,
        title: askedQuestion.title[locale],
        description: askedQuestion.description[locale],
      }
    },
  )

  return askedQuestionsTranslation
}

export async function createAskedQuestion(input: AskedQuestionSchema) {
  const created = await prisma.askedQuestion.create({
    data: input,
  })

  revalidateTag('asked-questions', { expire: 0 })
  revalidateTag('journeys', { expire: 0 })

  return created
}

export async function updateAskedQuestion(
  id: string,
  input: AskedQuestionSchema,
) {
  const askedQuestion = await prisma.askedQuestion.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const updated = await prisma.askedQuestion.update({
    where: {
      id: askedQuestion.id,
    },
    data: input,
  })

  revalidateTag(`asked-question-${id}`, { expire: 0 })
  revalidateTag('asked-questions', { expire: 0 })
  revalidateTag('journeys', { expire: 0 })

  return updated
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
  revalidateTag('journeys', { expire: 0 })

  return deleted
}

export async function getAskedQuestion(id: string) {
  const askedQuestion = await unstable_cache(
    async () => {
      return await prisma.askedQuestion.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`asked-question-${id}`],
    {
      tags: [`asked-question-${id}`, 'asked-questions'],
    },
  )()

  return askedQuestion
}
