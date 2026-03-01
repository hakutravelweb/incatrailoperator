'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { HomeSchema } from '@/schemas/home'
import { storageSave, storageUpdate, storageDelete } from '@/services/storage'

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

  revalidateTag('homes', { expire: 0 })
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

  revalidateTag(`home-${id}`, { expire: 0 })
  revalidateTag('homes', { expire: 0 })
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

  revalidateTag(`home-${id}`, { expire: 0 })
  revalidateTag('homes', { expire: 0 })
  return deleted
}

export async function getHomeLocale(locale: Locale) {
  const home = await unstable_cache(
    async () => {
      return await prisma.home.findFirstOrThrow({
        where: {
          locale,
        },
      })
    },
    [`home-${locale}`],
    { tags: ['homes'] },
  )()

  return home
}

export async function getHomesPagination(
  search: string,
  limit: number,
  offset: number,
) {
  const [homes, total] = await unstable_cache(
    async () => {
      return await Promise.all([
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
    },
    [`homes-pagination-${search}-${limit}-${offset}`],
    { tags: ['homes'] },
  )()

  return {
    data: homes,
    total,
  }
}

export async function getHome(id: string) {
  const home = await unstable_cache(
    async () => {
      return await prisma.home.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`home-${id}`],
    { tags: [`home-${id}`, 'homes'] },
  )()

  return home
}
