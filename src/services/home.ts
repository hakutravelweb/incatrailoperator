'use server'
import { cache } from 'react'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { storageSave, storageUpdate, storageDelete } from '@/services/storage'
import { HomeSchema } from '@/schemas/home'

export async function createHome(input: HomeSchema) {
  const { photo, previewPhoto, ...data } = input

  const existHome = await prisma.home.findFirst({
    where: {
      locale: data.locale,
    },
  })
  if (existHome) {
    throw new Error('HOME LOCALE EXISTS')
  }

  let newPhoto = ''
  if (photo) {
    newPhoto = await storageSave({
      file: photo,
      folder: 'homes',
    })
  }

  const created = await prisma.home.create({
    data: {
      ...data,
      photo: newPhoto,
    },
  })

  return created
}

export async function updateHome(id: string, input: HomeSchema) {
  const { photo, previewPhoto, ...data } = input

  const home = await prisma.home.findUniqueOrThrow({
    where: {
      id,
    },
  })

  if (data.locale !== home.locale) {
    const existHome = await prisma.home.findFirst({
      where: {
        locale: data.locale,
      },
    })
    if (existHome) {
      throw new Error('HOME LOCALE EXISTS')
    }
  }

  if (photo) {
    home.photo = await storageUpdate({
      file: photo,
      oldFileName: home.photo,
    })
  }

  const updated = await prisma.home.update({
    where: {
      id: home.id,
    },
    data: {
      ...data,
      photo: home.photo,
    },
  })

  return updated
}

export async function deleteHome(id: string) {
  const home = await prisma.home.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deleted = await prisma.home.delete({
    where: {
      id: home.id,
    },
  })

  await storageDelete({ fileName: home.photo })

  return deleted
}

export const getHomeLocale = cache(async (locale: Locale) => {
  const home = await prisma.home.findFirstOrThrow({
    where: {
      locale,
    },
  })

  return home
})

export const getHomesPagination = cache(
  async (search: string, limit: number, offset: number) => {
    const [homes, total] = await Promise.all([
      prisma.home.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip: offset,
      }),
      prisma.home.count(),
    ])

    return {
      data: homes,
      total,
    }
  },
)

export const getHome = cache(async (id: string) => {
  const home = await prisma.home.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return home
})
