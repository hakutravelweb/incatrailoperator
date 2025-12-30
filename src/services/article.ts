'use server'
import { cache } from 'react'
import { Locale, locales } from '@/i18n/config'
import { prisma } from '@/lib/prisma'
import { ArticleSchema } from '@/schemas/article'
import { Localization } from '@/interfaces/root'
import { Article } from '@/interfaces/article'
import { storageSave, storageUpdate, storageDelete } from '@/services/storage'
import { ArticleWhereInput } from '@/generated/prisma/models'

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
  const { photo, previewPhoto, ...data } = input

  const article = await prisma.article.findUniqueOrThrow({
    where: {
      id,
    },
  })

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
        introduction: article.introduction[locale],
        labels: article.labels[locale],
        content: article.content[locale],
        category: {
          ...article.category,
          title: article.category.title[locale],
          attractionProductsCount: 0,
        },
        localizations: [],
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

export const getArticlesCategoryPagination = cache(
  async (locale: Locale, categoryId: string, limit: number, offset: number) => {
    const where: ArticleWhereInput = {}
    if (categoryId) {
      where.categoryId = categoryId
    }
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
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
        introduction: article.introduction[locale],
        labels: article.labels[locale],
        content: article.content[locale],
        category: {
          ...article.category,
          title: article.category.title[locale],
          attractionProductsCount: 0,
        },
        localizations: [],
      }
    })

    return {
      data: articlesTranslate,
      total,
    }
  },
)

export const getArticleBySlug = cache(async (locale: Locale, slug: string) => {
  const article = await prisma.article.findFirstOrThrow({
    where: {
      slug: {
        path: [locale],
        equals: slug,
      },
    },
    include: {
      author: true,
      category: true,
    },
  })

  const localizations = locales.map<Localization>((locale) => {
    return {
      locale,
      slug: `/article/${article.slug[locale]}`,
    }
  })

  const articleTranslate: Article = {
    ...article,
    slug: article.slug[locale],
    title: article.title[locale],
    introduction: article.introduction[locale],
    labels: article.labels[locale],
    content: article.content[locale],
    category: {
      ...article.category,
      title: article.category.title[locale],
      attractionProductsCount: 0,
    },
    localizations,
  }

  return articleTranslate
})

export const getArticles = cache(async (locale: Locale) => {
  const articles = await prisma.article.findMany({
    include: {
      author: true,
      category: true,
    },
  })

  const articlesTranslate = articles.map<Article>((article) => {
    return {
      ...article,
      slug: article.slug[locale],
      title: article.title[locale],
      introduction: article.introduction[locale],
      labels: article.labels[locale],
      content: article.content[locale],
      category: {
        ...article.category,
        title: article.category.title[locale],
        attractionProductsCount: 0,
      },
      localizations: [],
    }
  })

  return articlesTranslate
})
