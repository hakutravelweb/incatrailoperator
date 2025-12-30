'use server'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { Locale } from '@/i18n/config'
import { ReviewSchema } from '@/schemas/review'

export async function createReview(input: ReviewSchema) {
  await prisma.review.findFirstOrThrow({
    where: {
      traveller: {
        path: ['email'],
        equals: input.traveller.email,
      },
    },
  })

  const created = await prisma.review.create({
    data: input,
  })

  return created
}

export async function deleteReview(id: string) {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deleted = await prisma.review.delete({
    where: {
      id: review.id,
    },
  })

  return deleted
}

export const getReviewsByAttractionProduct = cache(
  async (locale: Locale, attractionProductId: string) => {
    const reviews = await prisma.review.findMany({
      where: {
        locale,
        attractionProductId,
      },
    })

    return reviews
  },
)
