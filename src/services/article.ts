'use server'
import { revalidateTag, unstable_cache } from 'next/cache'
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

  revalidateTag('articles', { expire: 0 })
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

  revalidateTag(`article-${id}`, { expire: 0 })
  revalidateTag('articles', { expire: 0 })
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

  revalidateTag(`article-${id}`, { expire: 0 })
  revalidateTag('articles', { expire: 0 })
  return deleted
}

export async function getArticlesPagination(
  locale: Locale,
  search: string,
  limit: number,
  offset: number,
) {
  const [articles, total] = await unstable_cache(
    async () => {
      return await Promise.all([
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
    },
    [`articles-pagination-${locale}-${search}-${limit}-${offset}`],
    { tags: ['articles'] },
  )()

  const articlesTranslate = articles.map((article): Article => {
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
}

export async function getArticle(id: string) {
  const article = await unstable_cache(
    async () => {
      return await prisma.article.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    [`article-${id}`],
    { tags: [`article-${id}`, 'articles'] },
  )()

  return article
}

export async function getArticlesCategoryPagination(
  locale: Locale,
  categoryId: string,
  limit: number,
  offset: number,
) {
  const where: ArticleWhereInput = {}
  if (categoryId) {
    where.categoryId = categoryId
  }
  const [articles, total] = await unstable_cache(
    async () => {
      return await Promise.all([
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
    },
    [`articles-${locale}-${categoryId}-${limit}-${offset}`],
    { tags: ['articles'] },
  )()

  const articlesTranslate = articles.map((article): Article => {
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
}

export async function getArticleBySlug(locale: Locale, slug: string) {
  const article = await unstable_cache(
    async () => {
      return await prisma.article.findFirstOrThrow({
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
    },
    [`article-by-slug-${locale}-${slug}`],
    { tags: ['articles'] },
  )()

  const localizations = locales.map((locale): Localization => {
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
}

export async function getArticles(locale: Locale) {
  const articles = await unstable_cache(
    async () => {
      return await prisma.article.findMany({
        include: {
          author: true,
          category: true,
        },
      })
    },
    [`articles-${locale}`],
    { tags: ['articles'] },
  )()

  const articlesTranslate = articles.map((article): Article => {
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
}
