'use server'
import { cache } from 'react'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { DestinationSchema } from '@/schemas/destination'
import { Destination } from '@/interfaces/attraction-product'

export async function createDestination(input: DestinationSchema) {
  const created = await prisma.destination.create({
    data: input,
  })

  return created
}

export async function updateDestination(id: string, input: DestinationSchema) {
  const destination = await prisma.destination.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const updated = await prisma.destination.update({
    where: {
      id: destination.id,
    },
    data: input,
  })

  return updated
}

export async function deleteDestination(id: string) {
  const destination = await prisma.destination.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deletedAttractionProducts = await prisma.attractionProduct.findMany({
    where: {
      destinationId: destination.id,
    },
  })
  if (deletedAttractionProducts.length > 0) {
    throw new Error('CANNOT DELETE DESTINATION WITH ATTRACTION PRODUCTS')
  }

  const deleted = await prisma.destination.delete({
    where: {
      id: destination.id,
    },
  })

  return deleted
}

export const getDestinationsPagination = cache(
  async (locale: Locale, search: string, limit: number, offset: number) => {
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where: {
          title: {
            path: [locale],
            string_contains: search,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip: offset,
        include: {
          attractionProducts: true,
        },
      }),
      prisma.destination.count(),
    ])

    const destinationsTranslate = destinations.map<Destination>(
      (destination) => {
        return {
          ...destination,
          slug: destination.slug[locale],
          title: destination.title[locale],
          department: destination.department[locale],
          about: destination.about[locale],
          attractionProductsCount: destination.attractionProducts.length,
        }
      },
    )

    return {
      data: destinationsTranslate,
      total,
    }
  },
)

export const getDestination = cache(async (id: string) => {
  const destination = await prisma.destination.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return destination
})

export const getDestinations = cache(async (locale: Locale) => {
  const destinations = await prisma.destination.findMany()

  const destinationsTranslate = destinations.map<Destination>((destination) => {
    return {
      ...destination,
      slug: destination.slug[locale],
      title: destination.title[locale],
      department: destination.department[locale],
      about: destination.about[locale],
    }
  })

  return destinationsTranslate
})

export const getDestinationsPerDepartment = cache(async (locale: Locale) => {
  const destinations = await prisma.destination.findMany({
    include: {
      attractionProducts: {
        include: {
          reviews: true,
        },
      },
    },
  })

  const destinationsTranslate = destinations.map<Destination>((destination) => {
    if (destination.attractionProducts.length === 0) {
      return {
        id: destination.id,
        slug: destination.slug[locale],
        photo: '',
        title: destination.title[locale],
        department: destination.department[locale],
        rating: 0,
        travellersCount: 0,
        about: destination.about[locale],
        lowestPrice: 0,
      }
    }

    const { totalReviews, totalRating } = destination.attractionProducts.reduce(
      (acc, attractionProduct) => {
        const reviewsCount = attractionProduct.reviews.length
        const productRating = attractionProduct.reviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        )

        return {
          totalReviews: acc.totalReviews + reviewsCount,
          totalRating: acc.totalRating + productRating,
        }
      },
      { totalReviews: 0, totalRating: 0 },
    )

    const rating = totalReviews > 0 ? Math.round(totalRating / totalReviews) : 0

    const cheapestProduct = destination.attractionProducts.reduce(
      (lowest, product) =>
        product.retailPrice < lowest.retailPrice ? product : lowest,
      destination.attractionProducts[0],
    )

    return {
      id: destination.id,
      slug: destination.slug[locale],
      photo: cheapestProduct.photos[0],
      title: destination.title[locale],
      department: destination.department[locale],
      rating,
      travellersCount: totalReviews,
      about: destination.about[locale],
      lowestPrice: cheapestProduct.retailPrice,
    }
  })

  return destinationsTranslate
})
