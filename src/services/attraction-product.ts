'use server'
import { cache } from 'react'
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

  return created
}

export async function updateAttractionProduct(
  id: string,
  input: AttractionProductSchema,
) {
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

  await prisma.$transaction(async (transaction) => {
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
  })

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

  return deleted
}

export const getAttractionProductsPagination = cache(
  async (locale: Locale, search: string, limit: number, offset: number) => {
    const [attractionProducts, total] = await Promise.all([
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

    const attractionProductsTranslate =
      attractionProducts.map<AttractionProduct>((attractionProduct) => {
        attractionProduct
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
      })

    return {
      data: attractionProductsTranslate,
      total,
    }
  },
)

export const getAttractionProduct = cache(async (id: string) => {
  const attractionProduct = await prisma.attractionProduct.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return attractionProduct
})

export const getItinerary = cache(async (attractionProductId: string) => {
  const routes = await prisma.route.findMany({
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

  return routes
})

export async function saveItinerary(input: ItinerarySchema) {
  await prisma.$transaction(async (transaction) => {
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
  })
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

  return deleted
}

export async function deleteWaypoint(id: string) {
  const waypoint = await prisma.waypoint.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deleted = await prisma.waypoint.delete({
    where: {
      id: waypoint.id,
    },
  })

  return deleted
}

export const getAttractionProducts = cache(
  async (locale: Locale, search: string, category: string) => {
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
    const attractionProducts = await prisma.attractionProduct.findMany({
      where,
      include: {
        category: true,
        destination: true,
        reviews: true,
      },
      take: 20,
    })

    const attractionProductsTranslate =
      attractionProducts.map<AttractionProduct>((attractionProduct) => {
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
      })

    return attractionProductsTranslate
  },
)

export const getPopularAttractionProducts = cache(async (locale: Locale) => {
  const attractionProducts = await prisma.attractionProduct.findMany({
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    take: 5,
  })

  const attractionProductsTranslate = attractionProducts.map<
    Partial<AttractionProduct>
  >((attractionProduct) => {
    return {
      id: attractionProduct.id,
      slug: attractionProduct.slug[locale],
      title: attractionProduct.title[locale],
    }
  })

  return attractionProductsTranslate
})

export const getAttractionProductBySlug = cache(
  async (locale: Locale, slug: string) => {
    const attractionProduct = await prisma.attractionProduct.findFirstOrThrow({
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

    const routes = attractionProduct.routes.map<Route>((route) => {
      const waypoints = route.waypoints.map<Waypoint>((waypoint) => {
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

    const askedQuestions = attractionProduct.askedQuestions.map<AskedQuestion>(
      (askedQuestion) => {
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

    const localizations = locales.map<Localization>((locale) => {
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
  },
)

export const getAttractionProductsDestination = cache(
  async (filters: Filters) => {
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

    const attractionProducts = await prisma.attractionProduct.findMany({
      where,
      include: {
        reviews: true,
        category: true,
        destination: true,
      },
    })

    const attractionProductsTranslate = attractionProducts
      .map<AttractionProduct>((attractionProduct) => {
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
            department:
              attractionProduct.destination.department[filters.locale],
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
  },
)

export const getAttractionProductPackages = cache(async (locale: Locale) => {
  const attractionProducts = await prisma.attractionProduct.findMany({
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

  const attractionProductsTranslate = attractionProducts.map<AttractionProduct>(
    (attractionProduct) => {
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
})
