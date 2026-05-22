'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { Localization } from '@/shared/interfaces'
import { DestinationSchema } from '@/schemas/destination'
import { Destination } from '@/interfaces/journey'

export async function createDestination(input: DestinationSchema) {
  const t = await getTranslations('Language')

  const destinationExisting = await prisma.destination.findFirst({
    where: {
      OR: locales.map((locale) => {
        return {
          slug: { path: [locale], equals: input.slug[locale] },
        }
      }),
    },
  })
  if (destinationExisting) {
    const duplicatedLocales = locales
      .filter(
        (locale) => destinationExisting.slug[locale] === input.slug[locale],
      )
      .map((locale) => t(locale))
      .join(', ')
    throw new Error(`DUPLICATED_SLUG_ERROR_LOCALES: ${duplicatedLocales}`)
  }

  const created = await prisma.destination.create({
    data: input,
  })

  revalidateTag('destinations', { expire: 0 })

  return created
}

export async function updateDestination(id: string, input: DestinationSchema) {
  const t = await getTranslations('Language')

  const destinationExisting = await prisma.destination.findFirst({
    where: {
      NOT: {
        id,
      },
      OR: locales.map((locale) => {
        return {
          slug: { path: [locale], equals: input.slug[locale] },
        }
      }),
    },
  })
  if (destinationExisting) {
    const duplicatedLocales = locales
      .filter(
        (locale) => destinationExisting.slug[locale] === input.slug[locale],
      )
      .map((locale) => t(locale))
      .join(', ')
    throw new Error(`DUPLICATED_SLUG_ERROR_LOCALES: ${duplicatedLocales}`)
  }

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

  revalidateTag(`destination-${id}`, { expire: 0 })
  revalidateTag('destinations', { expire: 0 })

  return updated
}

export async function deleteDestination(id: string) {
  const destination = await prisma.destination.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deletedJourneys = await prisma.journey.findMany({
    where: {
      destinationId: destination.id,
    },
  })
  if (deletedJourneys.length > 0) {
    throw new Error('CANNOT DELETE DESTINATION WITH JOURNEYS')
  }

  const deleted = await prisma.destination.delete({
    where: {
      id: destination.id,
    },
  })

  revalidateTag(`destination-${id}`, { expire: 0 })
  revalidateTag('destinations', { expire: 0 })

  return deleted
}

export async function getDestinationsPagination(
  locale: Locale,
  search: string,
  limit: number,
  offset: number,
) {
  const [destinations, total] = await unstable_cache(
    async () => {
      return await Promise.all([
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
            journeys: true,
          },
        }),
        prisma.destination.count(),
      ])
    },
    [`destinations-pagination-${locale}-${search}-${limit}-${offset}`],
    { tags: ['destinations'] },
  )()

  const destinationsTranslation = destinations.map(
    (destination): Destination => {
      return {
        ...destination,
        slug: destination.slug[locale],
        title: destination.title[locale],
        department: destination.department[locale],
        about: destination.about[locale],
        journeysCount: destination.journeys.length,
        photo: '',
        rating: 0,
        travellersCount: 0,
        lowestPrice: 0,
        localizations: [],
      }
    },
  )

  return {
    data: destinationsTranslation,
    total,
  }
}

export async function getDestination(id: string) {
  const destination = await unstable_cache(
    async () => {
      return await prisma.destination.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`destination-${id}`],
    { tags: [`destination-${id}`, 'destinations'] },
  )()

  return destination
}

export async function getDestinations(locale: Locale) {
  const destinations = await unstable_cache(
    async () => {
      return await prisma.destination.findMany()
    },
    [`destinations-${locale}`],
    { tags: ['destinations'] },
  )()

  const destinationsTranslation = destinations.map(
    (destination): Destination => {
      return {
        ...destination,
        slug: destination.slug[locale],
        title: destination.title[locale],
        department: destination.department[locale],
        about: destination.about[locale],
        journeysCount: 0,
        photo: '',
        rating: 0,
        travellersCount: 0,
        lowestPrice: 0,
        localizations: [],
      }
    },
  )

  return destinationsTranslation
}

export async function getDestinationsPerDepartment(locale: Locale) {
  const destinations = await unstable_cache(
    async () => {
      return await prisma.destination.findMany({
        include: {
          journeys: {
            include: {
              reviews: true,
            },
          },
        },
      })
    },
    [`destinations-per-deparment-${locale}`],
    { tags: ['destinations'] },
  )()

  const destinationsTranslation = destinations.map(
    (destination): Destination => {
      if (destination.journeys.length === 0) {
        return {
          id: destination.id,
          slug: destination.slug[locale],
          title: destination.title[locale],
          department: destination.department[locale],
          about: destination.about[locale],
          journeysCount: 0,
          photo: '',
          rating: 0,
          travellersCount: 0,
          lowestPrice: 0,
          localizations: [],
        }
      }

      const { totalReviews, totalRating } = destination.journeys.reduce(
        (acc, journey) => {
          const reviewsCount = journey.reviews.length
          const productRating = journey.reviews.reduce(
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

      const rating =
        totalReviews > 0 ? Math.round(totalRating / totalReviews) : 0

      const cheapestProduct = destination.journeys.reduce(
        (lowest, journey) =>
          journey.retailPrice < lowest.retailPrice ? journey : lowest,
        destination.journeys[0],
      )

      return {
        id: destination.id,
        slug: destination.slug[locale],
        title: destination.title[locale],
        department: destination.department[locale],
        about: destination.about[locale],
        photo: cheapestProduct.photos[0],
        journeysCount: 0,
        rating,
        travellersCount: totalReviews,
        lowestPrice: cheapestProduct.retailPrice,
        localizations: [],
      }
    },
  )

  return destinationsTranslation
}

export async function getDestinationBySlug(locale: Locale, slug: string) {
  const destination = await unstable_cache(
    async () => {
      return await prisma.destination.findFirstOrThrow({
        where: {
          slug: {
            path: [locale],
            equals: slug,
          },
        },
      })
    },
    [`destination-by-slug-${locale}-${slug}`],
    { tags: ['destinations'] },
  )()

  const localizations = locales.map((locale): Localization => {
    return {
      locale,
      slug: `/destination/${destination.slug[locale]}`,
    }
  })

  const destinationTranslation: Destination = {
    ...destination,
    slug: destination.slug[locale],
    title: destination.title[locale],
    department: destination.department[locale],
    about: destination.about[locale],
    journeysCount: 0,
    photo: '',
    rating: 0,
    travellersCount: 0,
    lowestPrice: 0,
    localizations,
  }

  return destinationTranslation
}

export async function getDestinationsSitemap(locale: Locale) {
  const destinations = await prisma.destination.findMany()

  const destinationsTranslation = destinations.map(
    (destination): Destination => {
      return {
        ...destination,
        slug: destination.slug[locale],
        title: destination.title[locale],
        department: destination.department[locale],
        about: destination.about[locale],
        journeysCount: 0,
        photo: '',
        rating: 0,
        travellersCount: 0,
        lowestPrice: 0,
        localizations: [],
      }
    },
  )

  return destinationsTranslation
}
