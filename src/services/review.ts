'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
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

  revalidateTag('reviews', { expire: 0 })
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

  revalidateTag('reviews', { expire: 0 })
  return deleted
}

export async function getReviewsByAttractionProduct(
  locale: Locale,
  attractionProductId: string,
) {
  const reviews = await unstable_cache(
    async () => {
      return await prisma.review.findMany({
        where: {
          locale,
          attractionProductId,
        },
      })
    },
    [`reviews-${locale}-${attractionProductId}`],
    { tags: ['reviews'] },
  )()

  return reviews
}
