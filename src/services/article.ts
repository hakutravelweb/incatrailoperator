'use server'
import { cache } from 'react'
import { Locale } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { storageSave, storageUpdate, storageDelete } from '@/services/storage'
import { ArticleSchema } from '@/schemas/article'
import { Article } from '@/interfaces/article'

export async function createArticle(input: ArticleSchema) {
  const { photo, previewPhoto, ...data } = input

  let newPhoto = ''
  if (photo) {
    newPhoto = await storageSave({
      file: photo,
      folder: 'articles',
    })
  }

  const created = await prisma.article.create({
    data: {
      ...data,
      photo: newPhoto,
    },
  })

  return created
}

export async function updateArticle(id: string, input: ArticleSchema) {
  const article = await prisma.article.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const { photo, previewPhoto, ...data } = input

  if (photo) {
    article.photo = await storageUpdate({
      file: photo,
      oldFileName: article.photo,
    })
  }

  const updated = await prisma.article.update({
    where: {
      id: article.id,
    },
    data: {
      ...data,
      photo: article.photo,
    },
  })

  return updated
}

export async function deleteArticle(id: string) {
  const article = await prisma.article.findUniqueOrThrow({
    where: {
      id,
    },
  })

  const deleted = await prisma.article.delete({
    where: {
      id: article.id,
    },
  })

  await storageDelete({ fileName: article.photo })

  return deleted
}

export const getArticlesPagination = cache(
  async (locale: Locale, search: string, limit: number, offset: number) => {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
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
          author: true,
          category: true,
        },
      }),
      prisma.article.count(),
    ])

    const articlesTranslate = articles.map<Article>((article) => {
      return {
        ...article,
        slug: article.slug[locale],
        title: article.title[locale],
        description: article.description[locale],
        labels: article.labels[locale],
        content: article.content[locale],
        category: {
          ...article.category,
          title: article.category.title[locale],
        },
      }
    })

    return {
      data: articlesTranslate,
      total,
    }
  },
)

export const getArticle = cache(async (id: string) => {
  const article = await prisma.article.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return article
})
