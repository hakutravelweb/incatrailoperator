'use server'
import { cache } from 'react'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { CategorySchema } from '@/schemas/category'
import { Category } from '@/interfaces/attraction-product'

export async function createCategory(input: CategorySchema) {
  const created = await prisma.category.create({
    data: input,
  })

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

  return updated
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deletedAttractionProducts = await prisma.attractionProduct.findMany({
    where: {
      categoryId: category.id,
    },
  })
  if (deletedAttractionProducts.length > 0) {
    throw new Error('CANNOT DELETE CATEGORY WITH ATTRACTION PRODUCTS')
  }

  const deleted = await prisma.category.delete({
    where: {
      id: category.id,
    },
  })

  return deleted
}

export const getCategoriesPagination = cache(
  async (locale: Locale, search: string, limit: number, offset: number) => {
    const [categories, total] = await Promise.all([
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
          attractionProducts: true,
        },
      }),
      prisma.category.count(),
    ])

    const categoriesTranslate = categories.map<Category>((category) => {
      return {
        ...category,
        title: category.title[locale],
        productAttractionQuantity: category.attractionProducts.length,
      }
    })

    return {
      data: categoriesTranslate,
      total,
    }
  },
)

export const getCategory = cache(async (id: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return category
})

export const getCategories = cache(async (locale: Locale) => {
  const categories = await prisma.category.findMany()

  const categoriesTranslate = categories.map<Category>((category) => {
    return {
      ...category,
      title: category.title[locale],
      productAttractionQuantity: 0,
    }
  })

  return categoriesTranslate
})
