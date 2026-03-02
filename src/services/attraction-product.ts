'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { Locale, locales } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import {
  storageSave,
  storageSaveFiles,
  storageUpdate,
  storageDeleteFiles,
} from '@/services/storage'
import { Localization } from '@/interfaces/root'
import {
  AttractionProductSchema,
  ItinerarySchema,
} from '@/schemas/attraction-product'
import {
  AttractionProduct,
  Route,
  Waypoint,
  AskedQuestion,
  Filters,
} from '@/interfaces/attraction-product'
import { AttractionProductWhereInput } from '@/generated/prisma/models'

export async function createAttractionProduct(input: AttractionProductSchema) {
  const t = await getTranslations('Language')

  const {
    photos,
    previewPhotos,
    deletedPhotos,
    attractionMap,
    previewAttractionMap,
    attractionPdf,
    previewAttractionPdf,
    ...data
  } = input

  const attractionProductExisting = await prisma.attractionProduct.findFirst({
    where: {
      OR: locales.map((locale) => {
        return {
          slug: { path: [locale], equals: data.slug[locale] },
        }
      }),
    },
  })
  if (attractionProductExisting) {
    const duplicatedLocales = locales
      .filter(
        (locale) =>
          attractionProductExisting.slug[locale] === data.slug[locale],
      )
      .map((locale) => t(locale))
      .join(', ')
    throw new Error(`DUPLICATED_SLUG_ERROR_LOCALES: ${duplicatedLocales}`)
  }

  const newPhotos = await storageSaveFiles({
    files: photos,
    folder: 'attraction-products',
  })

  let newAttractionMap = ''
  if (attractionMap) {
    newAttractionMap = await storageSave({
      file: attractionMap,
      folder: 'attraction-products',
      subfolder: 'attraction-maps',
    })
  }

  let newAttractionPdf = ''
  if (attractionPdf) {
    newAttractionPdf = await storageSave({
      file: attractionPdf,
      folder: 'attraction-products',
      subfolder: 'attraction-pdfs',
    })
  }

  const created = await prisma.attractionProduct.create({
    data: {
      ...data,
      photos: newPhotos,
      attractionMap: newAttractionMap,
      attractionPdf: newAttractionPdf,
    },
  })

  revalidateTag('attraction-products', { expire: 0 })
  return created
}

export async function updateAttractionProduct(
  id: string,
  input: AttractionProductSchema,
) {
  const t = await getTranslations('Language')

  const {
    photos,
    previewPhotos,
    deletedPhotos,
    attractionMap,
    previewAttractionMap,
    attractionPdf,
    previewAttractionPdf,
    ...data
  } = input

  const attractionProductExisting = await prisma.attractionProduct.findFirst({
    where: {
      NOT: {
        id,
      },
      OR: locales.map((locale) => {
        return {
          slug: { path: [locale], equals: data.slug[locale] },
        }
      }),
    },
  })
  if (attractionProductExisting) {
    const duplicatedLocales = locales
      .filter(
        (locale) =>
          attractionProductExisting.slug[locale] === data.slug[locale],
      )
      .map((locale) => t(locale))
      .join(', ')
    throw new Error(`DUPLICATED_SLUG_ERROR_LOCALES: ${duplicatedLocales}`)
  }

  const attractionProduct = await prisma.attractionProduct.findUniqueOrThrow({
    where: {
      id,
    },
  })

  if (photos.length > 0) {
    const newPhotos = await storageSaveFiles({
      files: photos,
      folder: 'attraction-products',
    })
    attractionProduct.photos.push(...newPhotos)
  }

  if (deletedPhotos.length > 0) {
    await storageDeleteFiles({ fileNames: deletedPhotos })
    attractionProduct.photos = attractionProduct.photos.filter(
      (photo) => !deletedPhotos.includes(photo),
    )
  }

  if (attractionMap && attractionProduct.attractionMap) {
    attractionProduct.attractionMap = await storageUpdate({
      file: attractionMap,
      oldFileName: attractionProduct.attractionMap,
    })
  } else {
    if (attractionMap) {
      attractionProduct.attractionMap = await storageSave({
        file: attractionMap,
        folder: 'attraction-products',
        subfolder: 'attraction-maps',
      })
    }
  }

  if (attractionPdf && attractionProduct.attractionPdf) {
    attractionProduct.attractionPdf = await storageUpdate({
      file: attractionPdf,
      oldFileName: attractionProduct.attractionPdf,
    })
  } else {
    if (attractionPdf) {
      attractionProduct.attractionPdf = await storageSave({
        file: attractionPdf,
        folder: 'attraction-products',
        subfolder: 'attraction-pdfs',
      })
    }
  }

  const updated = await prisma.attractionProduct.update({
    where: {
      id: attractionProduct.id,
    },
    data: {
      ...data,
      photos: attractionProduct.photos,
      attractionMap: attractionProduct.attractionMap,
      attractionPdf: attractionProduct.attractionPdf,
    },
  })

  revalidateTag(`attraction-product-${id}`, { expire: 0 })
  revalidateTag('attraction-products', { expire: 0 })
  return updated
}

export async function deleteAttractionProduct(id: string) {
  const attractionProduct = await prisma.attractionProduct.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const routes = await prisma.route.findMany({
    where: {
      attractionProductId: attractionProduct.id,
    },
    include: {
      waypoints: true,
    },
  })

  await prisma.$transaction(
    async (transaction) => {
      const routeIds = routes.map((route) => route.id)
      const waypointIds = routes
        .map((route) => {
          const ids = route.waypoints.map((waypoint) => waypoint.id)
          return ids
        })
        .flatMap((id) => id)

      await transaction.waypoint.deleteMany({
        where: {
          id: {
            in: waypointIds,
          },
        },
      })
      await transaction.route.deleteMany({
        where: {
          id: {
            in: routeIds,
          },
        },
      })
      await transaction.askedQuestion.deleteMany({
        where: {
          attractionProductId: attractionProduct.id,
        },
      })
      await transaction.review.deleteMany({
        where: {
          attractionProductId: attractionProduct.id,
        },
      })
    },
    {
      timeout: 10000,
    },
  )

  const deleted = await prisma.attractionProduct.delete({
    where: {
      id: attractionProduct.id,
    },
  })

  if (attractionProduct.attractionMap) {
    attractionProduct.photos.push(attractionProduct.attractionMap)
  }
  if (attractionProduct.attractionPdf) {
    attractionProduct.photos.push(attractionProduct.attractionPdf)
  }
  await storageDeleteFiles({ fileNames: attractionProduct.photos })

  revalidateTag(`attraction-product-${id}`, { expire: 0 })
  revalidateTag('attraction-products', { expire: 0 })
  return deleted
}

export async function getAttractionProductsPagination(
  locale: Locale,
  search: string,
  limit: number,
  offset: number,
) {
  const [attractionProducts, total] = await unstable_cache(
    async () => {
      return await Promise.all([
        prisma.attractionProduct.findMany({
          where: {
            slug: {
              path: [locale],
              string_contains: search,
              mode: 'insensitive',
            },
            title: {
              path: [locale],
              string_contains: search,
              mode: 'insensitive',
            },
          },
          include: {
            category: true,
            destination: true,
          },
          take: limit,
          skip: offset,
        }),
        prisma.attractionProduct.count(),
      ])
    },
    [`attraction-products-pagination-${locale}-${search}-${limit}-${offset}`],
    { tags: ['attraction-products'] },
  )()

  const attractionProductsTranslate = attractionProducts.map(
    (attractionProduct): AttractionProduct => {
      return {
        ...attractionProduct,
        slug: attractionProduct.slug[locale],
        title: attractionProduct.title[locale],
        about: attractionProduct.about[locale],
        labels: attractionProduct.labels[locale],
        guideLanguages: attractionProduct.guideLanguages[locale],
        pickUpService: attractionProduct.pickUpService[locale],
        startTime: attractionProduct.startTime[locale],
        finishTime: attractionProduct.finishTime[locale],
        highlights: attractionProduct.highlights[locale],
        detailedDescription: attractionProduct.detailedDescription[locale],
        importantNote: attractionProduct.importantNote[locale],
        includes: attractionProduct.includes[locale],
        notIncluded: attractionProduct.notIncluded[locale],
        importantWarning: attractionProduct.importantWarning[locale],
        recommendations: attractionProduct.recommendations[locale],
        additionalAdvice: attractionProduct.additionalAdvice[locale],
        codeWetravel: attractionProduct.codeWetravel[locale],
        category: {
          ...attractionProduct.category,
          title: attractionProduct.category.title[locale],
          attractionProductsCount: 0,
        },
        destination: {
          ...attractionProduct.destination,
          slug: attractionProduct.destination.slug[locale],
          title: attractionProduct.destination.title[locale],
          department: attractionProduct.destination.department[locale],
          about: attractionProduct.destination.about[locale],
          attractionProductsCount: 0,
          photo: '',
          rating: 0,
          travellersCount: 0,
          lowestPrice: 0,
          localizations: [],
        },
        routes: [],
        askedQuestions: [],
        reviews: [],
        rating: 0,
        reviewsCount: 0,
        localizations: [],
      }
    },
  )

  return {
    data: attractionProductsTranslate,
    total,
  }
}

export async function getAttractionProduct(id: string) {
  const attractionProduct = await unstable_cache(
    async () => {
      return await prisma.attractionProduct.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`attraction-product-${id}`],
    {
      tags: [`attraction-product-${id}`, 'attraction-products'],
    },
  )()

  return attractionProduct
}

export async function getItinerary(attractionProductId: string) {
  const routes = await unstable_cache(
    async () => {
      return await prisma.route.findMany({
        where: {
          attractionProductId,
        },
        include: {
          waypoints: {
            orderBy: {
              time: 'asc',
            },
          },
        },
      })
    },
    [`itinerary-${attractionProductId}`],
    {
      tags: [`itinerary-${attractionProductId}`, 'attraction-products'],
    },
  )()

  return routes
}

export async function saveItinerary(input: ItinerarySchema) {
  await prisma.$transaction(
    async (transaction) => {
      await Promise.all(
        input.routes.map(async (route) => {
          const { routeId, ...data } = route
          if (route.routeId) {
            const waypointsToUpdate = data.waypoints.filter(
              (waypoint) => waypoint.waypointId,
            )
            const waypointsToCreate = data.waypoints.filter(
              (waypoint) => !waypoint.waypointId,
            )
            const waypoints = waypointsToUpdate.map((waypoint) => {
              const { waypointId, routeId, ...data } = waypoint

              return {
                data,
                where: {
                  id: waypointId,
                },
              }
            })

            await transaction.route.update({
              data: {
                title: data.title,
                waypoints: {
                  updateMany: waypoints,
                  createMany: {
                    data: waypointsToCreate,
                  },
                },
              },
              where: {
                id: routeId,
              },
            })
          } else {
            const waypoints = data.waypoints.map((waypoint) => {
              const { waypointId, routeId, ...data } = waypoint

              return data
            })
            await transaction.route.create({
              data: {
                title: data.title,
                attractionProductId: data.attractionProductId,
                waypoints: {
                  createMany: { data: waypoints },
                },
              },
            })
          }
        }),
      )
    },
    {
      timeout: 10000,
    },
  )
  if (input.routes[0]?.attractionProductId) {
    revalidateTag(`itinerary-${input.routes[0].attractionProductId}`, {
      expire: 0,
    })
  }
}

export async function deleteRoute(id: string) {
  const route = await prisma.route.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      waypoints: true,
    },
  })

  await prisma.waypoint.deleteMany({
    where: {
      routeId: route.id,
    },
  })

  const deleted = await prisma.route.delete({
    where: {
      id: route.id,
    },
  })

  revalidateTag(`itinerary-${route.attractionProductId}`, { expire: 0 })
  return deleted
}

export async function deleteWaypoint(id: string) {
  const waypoint = await prisma.waypoint.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      route: true,
    },
  })

  const deleted = await prisma.waypoint.delete({
    where: {
      id: waypoint.id,
    },
  })

  revalidateTag(`itinerary-${waypoint.route.attractionProductId}`, {
    expire: 0,
  })
  return deleted
}

export async function getAttractionProducts(
  locale: Locale,
  search: string,
  category: string,
) {
  const where: AttractionProductWhereInput = {
    destination: {
      title: {
        path: [locale],
        string_contains: search,
        mode: 'insensitive',
      },
    },
  }
  if (category) {
    where.categoryId = category
  }

  const attractionProducts = await unstable_cache(
    async () => {
      return await prisma.attractionProduct.findMany({
        where,
        include: {
          category: true,
          destination: true,
          reviews: true,
        },
        take: 20,
      })
    },
    [`attraction-products-${locale}-${search}-${category}`],
    { tags: ['attraction-products'] },
  )()

  const attractionProductsTranslate = attractionProducts.map(
    (attractionProduct): AttractionProduct => {
      const reviewsCount = attractionProduct.reviews.length
      const totalRating = attractionProduct.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )
      const rating =
        attractionProduct.reviews.length > 0
          ? Math.round(totalRating / attractionProduct.reviews.length)
          : 0

      return {
        ...attractionProduct,
        slug: attractionProduct.slug[locale],
        title: attractionProduct.title[locale],
        about: attractionProduct.about[locale],
        labels: attractionProduct.labels[locale],
        guideLanguages: attractionProduct.guideLanguages[locale],
        pickUpService: attractionProduct.pickUpService[locale],
        startTime: attractionProduct.startTime[locale],
        finishTime: attractionProduct.finishTime[locale],
        highlights: attractionProduct.highlights[locale],
        detailedDescription: attractionProduct.detailedDescription[locale],
        importantNote: attractionProduct.importantNote[locale],
        includes: attractionProduct.includes[locale],
        notIncluded: attractionProduct.notIncluded[locale],
        importantWarning: attractionProduct.importantWarning[locale],
        recommendations: attractionProduct.recommendations[locale],
        additionalAdvice: attractionProduct.additionalAdvice[locale],
        codeWetravel: attractionProduct.codeWetravel[locale],
        category: {
          ...attractionProduct.category,
          title: attractionProduct.category.title[locale],
          attractionProductsCount: 0,
        },
        destination: {
          ...attractionProduct.destination,
          slug: attractionProduct.destination.slug[locale],
          title: attractionProduct.destination.title[locale],
          department: attractionProduct.destination.department[locale],
          about: attractionProduct.destination.about[locale],
          attractionProductsCount: 0,
          photo: '',
          rating: 0,
          travellersCount: 0,
          lowestPrice: 0,
          localizations: [],
        },
        routes: [],
        askedQuestions: [],
        reviews: [],
        rating,
        reviewsCount,
        localizations: [],
      }
    },
  )

  return attractionProductsTranslate
}

export async function getAttractionProductBySlug(locale: Locale, slug: string) {
  const attractionProduct = await unstable_cache(
    async () => {
      return await prisma.attractionProduct.findFirstOrThrow({
        where: {
          slug: {
            path: [locale],
            equals: slug,
          },
        },
        include: {
          category: true,
          destination: true,
          routes: {
            include: {
              waypoints: true,
            },
          },
          askedQuestions: true,
          reviews: {
            where: {
              locale,
            },
          },
        },
      })
    },
    [`attraction-product-by-slug-${locale}-${slug}`],
    { tags: ['attraction-products'] },
  )()

  const routes = attractionProduct.routes.map((route): Route => {
    const waypoints = route.waypoints.map((waypoint): Waypoint => {
      return {
        ...waypoint,
        title: waypoint.title[locale],
        description: waypoint.description[locale],
      }
    })

    return {
      ...route,
      title: route.title[locale],
      waypoints,
    }
  })

  const askedQuestions = attractionProduct.askedQuestions.map(
    (askedQuestion): AskedQuestion => {
      return {
        ...askedQuestion,
        title: askedQuestion.title[locale],
        description: askedQuestion.description[locale],
      }
    },
  )

  const reviewsCount = attractionProduct.reviews.length
  const totalRating = attractionProduct.reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  )
  const rating =
    attractionProduct.reviews.length > 0
      ? Math.round(totalRating / attractionProduct.reviews.length)
      : 0

  const localizations = locales.map((locale): Localization => {
    return {
      locale,
      slug: `/attraction-product/${attractionProduct.slug[locale]}`,
    }
  })

  const attractionProductTranslate: AttractionProduct = {
    ...attractionProduct,
    slug: attractionProduct.slug[locale],
    title: attractionProduct.title[locale],
    about: attractionProduct.about[locale],
    labels: attractionProduct.labels[locale],
    guideLanguages: attractionProduct.guideLanguages[locale],
    pickUpService: attractionProduct.pickUpService[locale],
    startTime: attractionProduct.startTime[locale],
    finishTime: attractionProduct.finishTime[locale],
    highlights: attractionProduct.highlights[locale],
    detailedDescription: attractionProduct.detailedDescription[locale],
    importantNote: attractionProduct.importantNote[locale],
    includes: attractionProduct.includes[locale],
    notIncluded: attractionProduct.notIncluded[locale],
    importantWarning: attractionProduct.importantWarning[locale],
    recommendations: attractionProduct.recommendations[locale],
    additionalAdvice: attractionProduct.additionalAdvice[locale],
    codeWetravel: attractionProduct.codeWetravel[locale],
    category: {
      ...attractionProduct.category,
      title: attractionProduct.category.title[locale],
      attractionProductsCount: 0,
    },
    destination: {
      ...attractionProduct.destination,
      slug: attractionProduct.destination.slug[locale],
      title: attractionProduct.destination.title[locale],
      department: attractionProduct.destination.department[locale],
      about: attractionProduct.destination.about[locale],
      attractionProductsCount: 0,
      photo: '',
      rating: 0,
      travellersCount: 0,
      lowestPrice: 0,
      localizations: [],
    },
    routes,
    askedQuestions,
    rating,
    reviewsCount,
    localizations,
  }

  return attractionProductTranslate
}

export async function getAttractionProductsDestination(filters: Filters) {
  const where: AttractionProductWhereInput = {
    destinationId: filters.destinationId,
    title: {
      path: [filters.locale],
      string_contains: filters.search,
      mode: 'insensitive',
    },
    retailPrice: {
      gte: filters.rangePrice.from,
      lte: filters.rangePrice.to,
    },
  }
  if (filters.categoriesId.length > 0) {
    where.categoryId = {
      in: filters.categoriesId,
    }
  }

  const attractionProducts = await unstable_cache(
    async () => {
      return await prisma.attractionProduct.findMany({
        where,
        include: {
          reviews: true,
          category: true,
          destination: true,
        },
      })
    },
    [
      `attraction-products-destination-${filters.locale}-${filters.search}-${filters.rangePrice.from}-${filters.rangePrice.to}-${filters.categoriesId.join(',')}`,
    ],
    { tags: ['attraction-products'] },
  )()

  const attractionProductsTranslate = attractionProducts
    .map((attractionProduct): AttractionProduct => {
      const reviewsCount = attractionProduct.reviews.length
      const totalRating = attractionProduct.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )
      const rating =
        attractionProduct.reviews.length > 0
          ? Math.round(totalRating / attractionProduct.reviews.length)
          : 0

      return {
        ...attractionProduct,
        slug: attractionProduct.slug[filters.locale],
        title: attractionProduct.title[filters.locale],
        about: attractionProduct.about[filters.locale],
        labels: attractionProduct.labels[filters.locale],
        guideLanguages: attractionProduct.guideLanguages[filters.locale],
        pickUpService: attractionProduct.pickUpService[filters.locale],
        startTime: attractionProduct.startTime[filters.locale],
        finishTime: attractionProduct.finishTime[filters.locale],
        highlights: attractionProduct.highlights[filters.locale],
        detailedDescription:
          attractionProduct.detailedDescription[filters.locale],
        importantNote: attractionProduct.importantNote[filters.locale],
        includes: attractionProduct.includes[filters.locale],
        notIncluded: attractionProduct.notIncluded[filters.locale],
        importantWarning: attractionProduct.importantWarning[filters.locale],
        recommendations: attractionProduct.recommendations[filters.locale],
        additionalAdvice: attractionProduct.additionalAdvice[filters.locale],
        codeWetravel: attractionProduct.codeWetravel[filters.locale],
        category: {
          ...attractionProduct.category,
          title: attractionProduct.category.title[filters.locale],
          attractionProductsCount: 0,
        },
        destination: {
          ...attractionProduct.destination,
          slug: attractionProduct.destination.slug[filters.locale],
          title: attractionProduct.destination.title[filters.locale],
          department: attractionProduct.destination.department[filters.locale],
          about: attractionProduct.destination.about[filters.locale],
          attractionProductsCount: 0,
          photo: '',
          rating: 0,
          travellersCount: 0,
          lowestPrice: 0,
          localizations: [],
        },
        routes: [],
        askedQuestions: [],
        reviews: [],
        rating,
        reviewsCount,
        localizations: [],
      }
    })
    .filter((attractionProduct) =>
      filters.ratings.length > 0
        ? filters.ratings.includes(attractionProduct.rating)
        : attractionProduct,
    )

  return attractionProductsTranslate
}

export async function getAttractionProductPackages(locale: Locale) {
  const attractionProducts = await unstable_cache(
    async () => {
      return await prisma.attractionProduct.findMany({
        where: {
          variant: 'PACKAGE',
        },
        include: {
          category: true,
          destination: true,
          reviews: true,
        },
        take: 10,
      })
    },
    [`attraction-product-packages-${locale}`],
    { tags: ['attraction-products'] },
  )()

  const attractionProductsTranslate = attractionProducts.map(
    (attractionProduct): AttractionProduct => {
      const reviewsCount = attractionProduct.reviews.length
      const totalRating = attractionProduct.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )
      const rating =
        attractionProduct.reviews.length > 0
          ? Math.round(totalRating / attractionProduct.reviews.length)
          : 0

      return {
        ...attractionProduct,
        slug: attractionProduct.slug[locale],
        title: attractionProduct.title[locale],
        about: attractionProduct.about[locale],
        labels: attractionProduct.labels[locale],
        guideLanguages: attractionProduct.guideLanguages[locale],
        pickUpService: attractionProduct.pickUpService[locale],
        startTime: attractionProduct.startTime[locale],
        finishTime: attractionProduct.finishTime[locale],
        highlights: attractionProduct.highlights[locale],
        detailedDescription: attractionProduct.detailedDescription[locale],
        importantNote: attractionProduct.importantNote[locale],
        includes: attractionProduct.includes[locale],
        notIncluded: attractionProduct.notIncluded[locale],
        importantWarning: attractionProduct.importantWarning[locale],
        recommendations: attractionProduct.recommendations[locale],
        additionalAdvice: attractionProduct.additionalAdvice[locale],
        codeWetravel: attractionProduct.codeWetravel[locale],
        category: {
          ...attractionProduct.category,
          title: attractionProduct.category.title[locale],
          attractionProductsCount: 0,
        },
        destination: {
          ...attractionProduct.destination,
          slug: attractionProduct.destination.slug[locale],
          title: attractionProduct.destination.title[locale],
          department: attractionProduct.destination.department[locale],
          about: attractionProduct.destination.about[locale],
          attractionProductsCount: 0,
          photo: '',
          rating: 0,
          travellersCount: 0,
          lowestPrice: 0,
          localizations: [],
        },
        routes: [],
        askedQuestions: [],
        reviews: [],
        rating,
        reviewsCount,
        localizations: [],
      }
    },
  )

  return attractionProductsTranslate
}

export async function getAttractionProductsList(locale: Locale) {
  const attractionProducts = await unstable_cache(
    async () => {
      return await prisma.attractionProduct.findMany({
        include: {
          category: true,
          destination: true,
        },
      })
    },
    [`attraction-products-${locale}`],
    { tags: ['attraction-products'] },
  )()

  const attractionProductsTranslate = attractionProducts.map(
    (attractionProduct): AttractionProduct => {
      return {
        ...attractionProduct,
        slug: attractionProduct.slug[locale],
        title: attractionProduct.title[locale],
        about: attractionProduct.about[locale],
        labels: attractionProduct.labels[locale],
        guideLanguages: attractionProduct.guideLanguages[locale],
        pickUpService: attractionProduct.pickUpService[locale],
        startTime: attractionProduct.startTime[locale],
        finishTime: attractionProduct.finishTime[locale],
        highlights: attractionProduct.highlights[locale],
        detailedDescription: attractionProduct.detailedDescription[locale],
        importantNote: attractionProduct.importantNote[locale],
        includes: attractionProduct.includes[locale],
        notIncluded: attractionProduct.notIncluded[locale],
        importantWarning: attractionProduct.importantWarning[locale],
        recommendations: attractionProduct.recommendations[locale],
        additionalAdvice: attractionProduct.additionalAdvice[locale],
        codeWetravel: attractionProduct.codeWetravel[locale],
        category: {
          ...attractionProduct.category,
          title: attractionProduct.category.title[locale],
          attractionProductsCount: 0,
        },
        destination: {
          ...attractionProduct.destination,
          slug: attractionProduct.destination.slug[locale],
          title: attractionProduct.destination.title[locale],
          department: attractionProduct.destination.department[locale],
          about: attractionProduct.destination.about[locale],
          attractionProductsCount: 0,
          photo: '',
          rating: 0,
          travellersCount: 0,
          lowestPrice: 0,
          localizations: [],
        },
        routes: [],
        askedQuestions: [],
        reviews: [],
        rating: 0,
        reviewsCount: 0,
        localizations: [],
      }
    },
  )

  return attractionProductsTranslate
}
