'use server'
import { cache } from 'react'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import {
  storageSave,
  storageSaveFiles,
  storageUpdate,
  storageDeleteFiles,
} from '@/services/storage'
import {
  AttractionProductSchema,
  ItinerarySchema,
} from '@/schemas/attraction-product'
import { AttractionProduct } from '@/interfaces/attraction-product'

export async function createAttractionProduct(input: AttractionProductSchema) {
  const {
    photos,
    previewPhotos,
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
      file: attractionMap!,
      folder: 'attraction-products',
    })
  }

  let newAttractionPdf = ''
  if (attractionPdf) {
    newAttractionPdf = await storageSave({
      file: attractionPdf!,
      folder: 'attraction-products',
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

  if (attractionMap) {
    attractionProduct.attractionMap = await storageUpdate({
      file: attractionMap,
      oldFileName: attractionProduct.attractionMap,
    })
  }

  if (attractionPdf) {
    attractionProduct.attractionPdf = await storageUpdate({
      file: attractionPdf,
      oldFileName: attractionProduct.attractionPdf,
    })
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
  })

  const deleted = await prisma.attractionProduct.delete({
    where: {
      id: attractionProduct.id,
    },
  })

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
          labels: attractionProduct.labels[locale],
          about: attractionProduct.about[locale],
          includes: attractionProduct.includes[locale],
          notIncluded: attractionProduct.notIncluded[locale],
          recommendations: attractionProduct.recommendations[locale],
          routes: [],
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
          await transaction.route.create({
            data: {
              title: data.title,
              attractionProductId: data.attractionProductId,
              waypoints: {
                createMany: { data: data.waypoints },
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
