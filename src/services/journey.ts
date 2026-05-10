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
import { Localization } from '@/shared/interfaces'
import { JourneySchema, ItinerarySchema } from '@/schemas/journey'
import {
  Journey,
  Route,
  Waypoint,
  AskedQuestion,
  Filters,
} from '@/interfaces/journey'
import { JourneyWhereInput } from '@/generated/prisma/models'

export async function createJourney(input: JourneySchema) {
  const t = await getTranslations('Language')

  const {
    photos,
    previewPhotos,
    deletedPhotos,
    photoMap,
    previewPhotoMap,
    pdfItinerary,
    previewPdfItinerary,
    ...data
  } = input

  const journeyExisting = await prisma.journey.findFirst({
    where: {
      OR: locales.map((locale) => {
        return {
          slug: { path: [locale], equals: data.slug[locale] },
        }
      }),
    },
  })
  if (journeyExisting) {
    const duplicatedLocales = locales
      .filter((locale) => journeyExisting.slug[locale] === data.slug[locale])
      .map((locale) => t(locale))
      .join(', ')
    throw new Error(`DUPLICATED_SLUG_ERROR_LOCALES: ${duplicatedLocales}`)
  }

  const newPhotos = await storageSaveFiles({
    files: photos,
    folder: 'journeys',
  })

  let newPhotoMap = ''
  if (photoMap) {
    newPhotoMap = await storageSave({
      file: photoMap,
      folder: 'journeys',
      subfolder: 'journey-maps',
    })
  }

  let newPdfItinerary = ''
  if (pdfItinerary) {
    newPdfItinerary = await storageSave({
      file: pdfItinerary,
      folder: 'journeys',
      subfolder: 'journey-pdfs',
    })
  }

  const created = await prisma.journey.create({
    data: {
      ...data,
      photos: newPhotos,
      photoMap: newPhotoMap,
      pdfItinerary: newPdfItinerary,
    },
  })

  revalidateTag('journeys', { expire: 0 })
  return created
}

export async function updateJourney(id: string, input: JourneySchema) {
  const t = await getTranslations('Language')

  const {
    photos,
    previewPhotos,
    deletedPhotos,
    photoMap,
    previewPhotoMap,
    pdfItinerary,
    previewPdfItinerary,
    ...data
  } = input

  const journeyExisting = await prisma.journey.findFirst({
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
  if (journeyExisting) {
    const duplicatedLocales = locales
      .filter((locale) => journeyExisting.slug[locale] === data.slug[locale])
      .map((locale) => t(locale))
      .join(', ')
    throw new Error(`DUPLICATED_SLUG_ERROR_LOCALES: ${duplicatedLocales}`)
  }

  const journey = await prisma.journey.findUniqueOrThrow({
    where: {
      id,
    },
  })

  if (photos.length > 0) {
    const newPhotos = await storageSaveFiles({
      files: photos,
      folder: 'journeys',
    })
    journey.photos.push(...newPhotos)
  }

  if (deletedPhotos.length > 0) {
    await storageDeleteFiles({ fileNames: deletedPhotos })
    journey.photos = journey.photos.filter(
      (photo) => !deletedPhotos.includes(photo),
    )
  }

  if (photoMap && journey.photoMap) {
    journey.photoMap = await storageUpdate({
      file: photoMap,
      oldFileName: journey.photoMap,
    })
  } else {
    if (photoMap) {
      journey.photoMap = await storageSave({
        file: photoMap,
        folder: 'journeys',
        subfolder: 'journey-maps',
      })
    }
  }

  if (pdfItinerary && journey.pdfItinerary) {
    journey.pdfItinerary = await storageUpdate({
      file: pdfItinerary,
      oldFileName: journey.pdfItinerary,
    })
  } else {
    if (pdfItinerary) {
      journey.pdfItinerary = await storageSave({
        file: pdfItinerary,
        folder: 'journeys',
        subfolder: 'journey-pdfs',
      })
    }
  }

  const updated = await prisma.journey.update({
    where: {
      id: journey.id,
    },
    data: {
      ...data,
      photos: journey.photos,
      photoMap: journey.photoMap,
      pdfItinerary: journey.pdfItinerary,
    },
  })

  revalidateTag(`journey-${id}`, { expire: 0 })
  revalidateTag('journeys', { expire: 0 })
  return updated
}

export async function deleteJourney(id: string) {
  const journey = await prisma.journey.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const routes = await prisma.route.findMany({
    where: {
      journeyId: journey.id,
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
          journeyId: journey.id,
        },
      })
      await transaction.review.deleteMany({
        where: {
          journeyId: journey.id,
        },
      })
    },
    {
      timeout: 10000,
    },
  )

  const deleted = await prisma.journey.delete({
    where: {
      id: journey.id,
    },
  })

  if (journey.photoMap) {
    journey.photos.push(journey.photoMap)
  }
  if (journey.pdfItinerary) {
    journey.photos.push(journey.pdfItinerary)
  }
  await storageDeleteFiles({ fileNames: journey.photos })

  revalidateTag(`journey-${id}`, { expire: 0 })
  revalidateTag('journeys', { expire: 0 })
  return deleted
}

export async function getJourneysPagination(
  locale: Locale,
  search: string,
  limit: number,
  offset: number,
) {
  const [journeys, total] = await unstable_cache(
    async () => {
      return await Promise.all([
        prisma.journey.findMany({
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
        prisma.journey.count(),
      ])
    },
    [`journeys-pagination-${locale}-${search}-${limit}-${offset}`],
    { tags: ['journeys'] },
  )()

  const journeysTranslate = journeys.map((journey): Journey => {
    return {
      ...journey,
      slug: journey.slug[locale],
      title: journey.title[locale],
      about: journey.about[locale],
      labels: journey.labels[locale],
      pickUpService: journey.pickUpService[locale],
      startTime: journey.startTime[locale],
      finishTime: journey.finishTime[locale],
      highlights: journey.highlights[locale],
      detailedDescription: journey.detailedDescription[locale],
      importantNote: journey.importantNote[locale],
      inclusions: journey.inclusions[locale],
      exclusions: journey.exclusions[locale],
      importantWarning: journey.importantWarning[locale],
      recommendations: journey.recommendations[locale],
      additionalAdvice: journey.additionalAdvice[locale],
      category: {
        ...journey.category,
        title: journey.category.title[locale],
        journeysCount: 0,
      },
      destination: {
        ...journey.destination,
        slug: journey.destination.slug[locale],
        title: journey.destination.title[locale],
        department: journey.destination.department[locale],
        about: journey.destination.about[locale],
        journeysCount: 0,
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
  })

  return {
    data: journeysTranslate,
    total,
  }
}

export async function getJourney(id: string) {
  const journey = await unstable_cache(
    async () => {
      return await prisma.journey.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`journey-${id}`],
    {
      tags: [`journey-${id}`, 'journeys'],
    },
  )()

  return journey
}

export async function getItinerary(journeyId: string) {
  const routes = await unstable_cache(
    async () => {
      return await prisma.route.findMany({
        where: {
          journeyId,
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
    [`itinerary-${journeyId}`],
    {
      tags: [`itinerary-${journeyId}`, 'journeys'],
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
                journeyId: data.journeyId,
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
  if (input.routes[0]?.journeyId) {
    revalidateTag(`itinerary-${input.routes[0].journeyId}`, {
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

  revalidateTag(`itinerary-${route.journeyId}`, { expire: 0 })
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

  revalidateTag(`itinerary-${waypoint.route.journeyId}`, {
    expire: 0,
  })
  return deleted
}

export async function getJourneys(
  locale: Locale,
  search: string,
  category: string,
) {
  const where: JourneyWhereInput = {
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

  const journeys = await unstable_cache(
    async () => {
      return await prisma.journey.findMany({
        where,
        include: {
          category: true,
          destination: true,
          reviews: true,
        },
        take: 20,
      })
    },
    [`journeys-${locale}-${search}-${category}`],
    { tags: ['journeys'] },
  )()

  const journeysTranslate = journeys.map((journey): Journey => {
    const reviewsCount = journey.reviews.length
    const totalRating = journey.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    const rating =
      journey.reviews.length > 0
        ? Math.round(totalRating / journey.reviews.length)
        : 0

    return {
      ...journey,
      slug: journey.slug[locale],
      title: journey.title[locale],
      about: journey.about[locale],
      labels: journey.labels[locale],
      pickUpService: journey.pickUpService[locale],
      startTime: journey.startTime[locale],
      finishTime: journey.finishTime[locale],
      highlights: journey.highlights[locale],
      detailedDescription: journey.detailedDescription[locale],
      importantNote: journey.importantNote[locale],
      inclusions: journey.inclusions[locale],
      exclusions: journey.exclusions[locale],
      importantWarning: journey.importantWarning[locale],
      recommendations: journey.recommendations[locale],
      additionalAdvice: journey.additionalAdvice[locale],
      category: {
        ...journey.category,
        title: journey.category.title[locale],
        journeysCount: 0,
      },
      destination: {
        ...journey.destination,
        slug: journey.destination.slug[locale],
        title: journey.destination.title[locale],
        department: journey.destination.department[locale],
        about: journey.destination.about[locale],
        journeysCount: 0,
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

  return journeysTranslate
}

export async function getJourneyBySlug(locale: Locale, slug: string) {
  const journey = await unstable_cache(
    async () => {
      return await prisma.journey.findFirstOrThrow({
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
    [`journey-by-slug-${locale}-${slug}`],
    { tags: ['journeys'] },
  )()

  const routes = journey.routes.map((route): Route => {
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

  const askedQuestions = journey.askedQuestions.map(
    (askedQuestion): AskedQuestion => {
      return {
        ...askedQuestion,
        title: askedQuestion.title[locale],
        description: askedQuestion.description[locale],
      }
    },
  )

  const reviewsCount = journey.reviews.length
  const totalRating = journey.reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  )
  const rating =
    journey.reviews.length > 0
      ? Math.round(totalRating / journey.reviews.length)
      : 0

  const localizations = locales.map((locale): Localization => {
    return {
      locale,
      slug: `/journey/${journey.slug[locale]}`,
    }
  })

  const journeyTranslate: Journey = {
    ...journey,
    slug: journey.slug[locale],
    title: journey.title[locale],
    about: journey.about[locale],
    labels: journey.labels[locale],
    pickUpService: journey.pickUpService[locale],
    startTime: journey.startTime[locale],
    finishTime: journey.finishTime[locale],
    highlights: journey.highlights[locale],
    detailedDescription: journey.detailedDescription[locale],
    importantNote: journey.importantNote[locale],
    inclusions: journey.inclusions[locale],
    exclusions: journey.exclusions[locale],
    importantWarning: journey.importantWarning[locale],
    recommendations: journey.recommendations[locale],
    additionalAdvice: journey.additionalAdvice[locale],
    category: {
      ...journey.category,
      title: journey.category.title[locale],
      journeysCount: 0,
    },
    destination: {
      ...journey.destination,
      slug: journey.destination.slug[locale],
      title: journey.destination.title[locale],
      department: journey.destination.department[locale],
      about: journey.destination.about[locale],
      journeysCount: 0,
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

  return journeyTranslate
}

export async function getJourneysDestination(filters: Filters) {
  const where: JourneyWhereInput = {
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

  const journeys = await unstable_cache(
    async () => {
      return await prisma.journey.findMany({
        where,
        include: {
          reviews: true,
          category: true,
          destination: true,
        },
      })
    },
    [
      `journeys-destination-${filters.locale}-${filters.search}-${filters.rangePrice.from}-${filters.rangePrice.to}-${filters.categoriesId.join(',')}`,
    ],
    { tags: ['journeys'] },
  )()

  const journeysTranslate = journeys
    .map((journey): Journey => {
      const reviewsCount = journey.reviews.length
      const totalRating = journey.reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )
      const rating =
        journey.reviews.length > 0
          ? Math.round(totalRating / journey.reviews.length)
          : 0

      return {
        ...journey,
        slug: journey.slug[filters.locale],
        title: journey.title[filters.locale],
        about: journey.about[filters.locale],
        labels: journey.labels[filters.locale],
        pickUpService: journey.pickUpService[filters.locale],
        startTime: journey.startTime[filters.locale],
        finishTime: journey.finishTime[filters.locale],
        highlights: journey.highlights[filters.locale],
        detailedDescription: journey.detailedDescription[filters.locale],
        importantNote: journey.importantNote[filters.locale],
        inclusions: journey.inclusions[filters.locale],
        exclusions: journey.exclusions[filters.locale],
        importantWarning: journey.importantWarning[filters.locale],
        recommendations: journey.recommendations[filters.locale],
        additionalAdvice: journey.additionalAdvice[filters.locale],
        category: {
          ...journey.category,
          title: journey.category.title[filters.locale],
          journeysCount: 0,
        },
        destination: {
          ...journey.destination,
          slug: journey.destination.slug[filters.locale],
          title: journey.destination.title[filters.locale],
          department: journey.destination.department[filters.locale],
          about: journey.destination.about[filters.locale],
          journeysCount: 0,
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
    .filter((journey) =>
      filters.ratings.length > 0
        ? filters.ratings.includes(journey.rating)
        : journey,
    )

  return journeysTranslate
}

export async function getJourneyPackages(locale: Locale) {
  const journeys = await unstable_cache(
    async () => {
      return await prisma.journey.findMany({
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
    [`journey-packages-${locale}`],
    { tags: ['journeys'] },
  )()

  const journeysTranslate = journeys.map((journey): Journey => {
    const reviewsCount = journey.reviews.length
    const totalRating = journey.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    const rating =
      journey.reviews.length > 0
        ? Math.round(totalRating / journey.reviews.length)
        : 0

    return {
      ...journey,
      slug: journey.slug[locale],
      title: journey.title[locale],
      about: journey.about[locale],
      labels: journey.labels[locale],
      pickUpService: journey.pickUpService[locale],
      startTime: journey.startTime[locale],
      finishTime: journey.finishTime[locale],
      highlights: journey.highlights[locale],
      detailedDescription: journey.detailedDescription[locale],
      importantNote: journey.importantNote[locale],
      inclusions: journey.inclusions[locale],
      exclusions: journey.exclusions[locale],
      importantWarning: journey.importantWarning[locale],
      recommendations: journey.recommendations[locale],
      additionalAdvice: journey.additionalAdvice[locale],
      category: {
        ...journey.category,
        title: journey.category.title[locale],
        journeysCount: 0,
      },
      destination: {
        ...journey.destination,
        slug: journey.destination.slug[locale],
        title: journey.destination.title[locale],
        department: journey.destination.department[locale],
        about: journey.destination.about[locale],
        journeysCount: 0,
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

  return journeysTranslate
}

export async function getJourneysList(locale: Locale) {
  const journeys = await unstable_cache(
    async () => {
      return await prisma.journey.findMany({
        include: {
          category: true,
          destination: true,
        },
      })
    },
    [`journeys-${locale}`],
    { tags: ['journeys'] },
  )()

  const journeysTranslate = journeys.map((journey): Journey => {
    return {
      ...journey,
      slug: journey.slug[locale],
      title: journey.title[locale],
      about: journey.about[locale],
      labels: journey.labels[locale],
      pickUpService: journey.pickUpService[locale],
      startTime: journey.startTime[locale],
      finishTime: journey.finishTime[locale],
      highlights: journey.highlights[locale],
      detailedDescription: journey.detailedDescription[locale],
      importantNote: journey.importantNote[locale],
      inclusions: journey.inclusions[locale],
      exclusions: journey.exclusions[locale],
      importantWarning: journey.importantWarning[locale],
      recommendations: journey.recommendations[locale],
      additionalAdvice: journey.additionalAdvice[locale],
      category: {
        ...journey.category,
        title: journey.category.title[locale],
        journeysCount: 0,
      },
      destination: {
        ...journey.destination,
        slug: journey.destination.slug[locale],
        title: journey.destination.title[locale],
        department: journey.destination.department[locale],
        about: journey.destination.about[locale],
        journeysCount: 0,
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
  })

  return journeysTranslate
}
