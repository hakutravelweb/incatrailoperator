import { MetadataRoute } from 'next'
import { getFullMediaUrl } from '@/lib/utils'
import { routing } from '@/i18n/routing'
import { getArticles } from '@/services/article'
import { getJourneysList } from '@/services/journey'

const host = process.env.APP_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    }
  })
  const about = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  })
  const articles = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }
  })
  const articlesPromise = routing.locales.map(
    async (locale): Promise<MetadataRoute.Sitemap> => {
      const articles = await getArticles(locale)
      const sitemap = articles.map((article): MetadataRoute.Sitemap[0] => {
        return {
          url: `${host}/${locale}/article/${article.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
          images: [getFullMediaUrl(article.photo)],
        }
      })
      return sitemap
    },
  )
  const articlesResult = await Promise.all(articlesPromise)
  const articlesList = articlesResult.flatMap((dept) =>
    dept.flatMap((dest) => dest),
  )
  const contactUs = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  })
  const privacyPolicy = routing.locales.map(
    (locale): MetadataRoute.Sitemap[0] => {
      return {
        url: `${host}/${locale}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    },
  )
  const termsAndConditions = routing.locales.map(
    (locale): MetadataRoute.Sitemap[0] => {
      return {
        url: `${host}/${locale}/terms-and-conditions`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    },
  )
  const journeysPromise = routing.locales.map(
    async (locale): Promise<MetadataRoute.Sitemap> => {
      const journeys = await getJourneysList(locale)
      const sitemap = journeys.map((journey): MetadataRoute.Sitemap[0] => {
        return {
          url: `${host}/${locale}/journey/${journey.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
          images: [getFullMediaUrl(journey.photos[0])],
        }
      })
      return sitemap
    },
  )
  const journeysResult = await Promise.all(journeysPromise)
  const journey = journeysResult.flatMap((dept) => dept.flatMap((dest) => dest))

  return [
    ...root,
    ...about,
    ...articles,
    ...articlesList,
    ...contactUs,
    ...privacyPolicy,
    ...termsAndConditions,
    ...journey,
  ]
}
