import { MetadataRoute } from 'next'
import { getFullMediaUrl } from '@/lib/utils'
import { routing } from '@/i18n/routing'
import { getArticlesSitemap } from '@/services/article'
import { getDestinationsSitemap } from '@/services/destination'
import { getJourneysSitemap } from '@/services/journey'

const host = process.env.APP_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
      images: [`${host}/posters/banner.jpg`],
    }
  })
  const about = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${host}/posters/banner.jpg`],
    }
  })
  const articles = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
      images: [`${host}/posters/banner.jpg`],
    }
  })
  const articlesResult = await Promise.all(
    routing.locales.map(async (locale): Promise<MetadataRoute.Sitemap> => {
      const articles = await getArticlesSitemap(locale)
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
    }),
  )
  const articlesList = articlesResult.flatMap((dept) =>
    dept.flatMap((dest) => dest),
  )
  const contactUs = routing.locales.map((locale): MetadataRoute.Sitemap[0] => {
    return {
      url: `${host}/${locale}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${host}/posters/banner.jpg`],
    }
  })
  const privacyPolicy = routing.locales.map(
    (locale): MetadataRoute.Sitemap[0] => {
      return {
        url: `${host}/${locale}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        images: [`${host}/posters/banner.jpg`],
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
        images: [`${host}/posters/banner.jpg`],
      }
    },
  )
  const destinationsResult = await Promise.all(
    routing.locales.map(async (locale): Promise<MetadataRoute.Sitemap> => {
      const destinations = await getDestinationsSitemap(locale)
      const sitemap = destinations.map(
        (destination): MetadataRoute.Sitemap[0] => {
          return {
            url: `${host}/${locale}/destination/${destination.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
            images: [`${host}/posters/banner.jpg`],
          }
        },
      )
      return sitemap
    }),
  )
  const destinations = destinationsResult.flatMap((dept) =>
    dept.flatMap((dest) => dest),
  )
  const journeysResult = await Promise.all(
    routing.locales.map(async (locale): Promise<MetadataRoute.Sitemap> => {
      const journeys = await getJourneysSitemap(locale)
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
    }),
  )
  const journey = journeysResult.flatMap((dept) => dept.flatMap((dest) => dest))

  return [
    ...root,
    ...about,
    ...articles,
    ...articlesList,
    ...contactUs,
    ...privacyPolicy,
    ...termsAndConditions,
    ...destinations,
    ...journey,
  ]
}
