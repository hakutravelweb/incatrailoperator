'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { Localization } from '@/interfaces/root'
import { DestinationSchema } from '@/schemas/destination'
import { Destination } from '@/interfaces/attraction-product'

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
            attractionProducts: true,
          },
        }),
        prisma.destination.count(),
      ])
    },
    [`destinations-pagination-${locale}-${search}-${limit}-${offset}`],
    { tags: ['destinations'] },
  )()

  const destinationsTranslate = destinations.map((destination): Destination => {
    return {
      ...destination,
      slug: destination.slug[locale],
      title: destination.title[locale],
      department: destination.department[locale],
      about: destination.about[locale],
      attractionProductsCount: destination.attractionProducts.length,
      photo: '',
      rating: 0,
      travellersCount: 0,
      lowestPrice: 0,
      localizations: [],
    }
  })

  return {
    data: destinationsTranslate,
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

  const destinationsTranslate = destinations.map((destination): Destination => {
    return {
      ...destination,
      slug: destination.slug[locale],
      title: destination.title[locale],
      department: destination.department[locale],
      about: destination.about[locale],
      attractionProductsCount: 0,
      photo: '',
      rating: 0,
      travellersCount: 0,
      lowestPrice: 0,
      localizations: [],
    }
  })

  return destinationsTranslate
}

export async function getDestinationsPerDepartment(locale: Locale) {
  const destinations = await unstable_cache(
    async () => {
      return await prisma.destination.findMany({
        include: {
          attractionProducts: {
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

  const destinationsTranslate = destinations.map((destination): Destination => {
    if (destination.attractionProducts.length === 0) {
      return {
        id: destination.id,
        slug: destination.slug[locale],
        title: destination.title[locale],
        department: destination.department[locale],
        about: destination.about[locale],
        attractionProductsCount: 0,
        photo: '',
        rating: 0,
        travellersCount: 0,
        lowestPrice: 0,
        localizations: [],
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
      title: destination.title[locale],
      department: destination.department[locale],
      about: destination.about[locale],
      photo: cheapestProduct.photos[0],
      attractionProductsCount: 0,
      rating,
      travellersCount: totalReviews,
      lowestPrice: cheapestProduct.retailPrice,
      localizations: [],
    }
  })

  return destinationsTranslate
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

  const destinationTranslate: Destination = {
    ...destination,
    slug: destination.slug[locale],
    title: destination.title[locale],
    department: destination.department[locale],
    about: destination.about[locale],
    attractionProductsCount: 0,
    photo: '',
    rating: 0,
    travellersCount: 0,
    lowestPrice: 0,
    localizations,
  }

  return destinationTranslate
}
