'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { CategorySchema } from '@/schemas/category'
import { Category } from '@/interfaces/journey'

export async function createCategory(input: CategorySchema) {
  const created = await prisma.category.create({
    data: input,
  })

  revalidateTag('categories', { expire: 0 })
  return created
}

export async function updateCategory(id: string, input: CategorySchema) {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const updated = await prisma.category.update({
    where: {
      id: category.id,
    },
    data: input,
  })

  revalidateTag(`category-${id}`, { expire: 0 })
  revalidateTag('categories', { expire: 0 })

  return updated
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deletedJourneys = await prisma.journey.findMany({
    where: {
      categoryId: category.id,
    },
  })
  if (deletedJourneys.length > 0) {
    throw new Error('CANNOT DELETE CATEGORY WITH JOURNEYS')
  }

  const deleted = await prisma.category.delete({
    where: {
      id: category.id,
    },
  })

  revalidateTag(`category-${id}`, { expire: 0 })
  revalidateTag('categories', { expire: 0 })

  return deleted
}

export async function getCategoriesPagination(
  locale: Locale,
  search: string,
  limit: number,
  offset: number,
) {
  const [categories, total] = await unstable_cache(
    async () => {
      return await Promise.all([
        prisma.category.findMany({
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
        prisma.category.count(),
      ])
    },
    [`categories-pagination-${locale}-${search}-${limit}-${offset}`],
    { tags: ['categories'] },
  )()

  const categoriesTranslation = categories.map((category): Category => {
    return {
      ...category,
      title: category.title[locale],
      journeysCount: category.journeys.length,
    }
  })

  return {
    data: categoriesTranslation,
    total,
  }
}

export async function getCategory(id: string) {
  const category = await unstable_cache(
    async () => {
      return await prisma.category.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`category-${id}`],
    { tags: [`category-${id}`, 'categories'] },
  )()

  return category
}

export async function getCategories(locale: Locale) {
  const categories = await unstable_cache(
    async () => {
      return await prisma.category.findMany()
    },
    [`categories-${locale}`],
    { tags: ['categories'] },
  )()

  const categoriesTranslation = categories.map((category): Category => {
    return {
      ...category,
      title: category.title[locale],
      journeysCount: 0,
    }
  })

  return categoriesTranslation
}
