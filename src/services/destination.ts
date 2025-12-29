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
          title: destination.title[locale],
          department: destination.department[locale],
          about: destination.about[locale],
          productAttractionQuantity: destination.attractionProducts.length,
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
      title: destination.title[locale],
      department: destination.department[locale],
      about: destination.about[locale],
      productAttractionQuantity: 0,
    }
  })

  return destinationsTranslate
})
