import { MetadataRoute } from 'next'
import { getFullMediaUrl } from '@/lib/utils'
import { routing } from '@/i18n/routing'
import { getArticles } from '@/services/article'
import { getAttractionProductsList } from '@/services/attraction-product'

const host = process.env.APP_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = routing.locales.map<MetadataRoute.Sitemap[0]>((locale) => {
    return {
      url: `${host}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    }
  })
  const about = routing.locales.map<MetadataRoute.Sitemap[0]>((locale) => {
    return {
      url: `${host}/${locale}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  })
  const articles = routing.locales.map<MetadataRoute.Sitemap[0]>((locale) => {
    return {
      url: `${host}/${locale}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }
  })
  const articlesPromise = routing.locales.map<Promise<MetadataRoute.Sitemap>>(
    async (locale) => {
      const articles = await getArticles(locale)
      const sitemap = articles.map<MetadataRoute.Sitemap[0]>((article) => {
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
  const contactUs = routing.locales.map<MetadataRoute.Sitemap[0]>((locale) => {
    return {
      url: `${host}/${locale}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  })
  const privacyPolicy = routing.locales.map<MetadataRoute.Sitemap[0]>(
    (locale) => {
      return {
        url: `${host}/${locale}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    },
  )
  const termsAndConditions = routing.locales.map<MetadataRoute.Sitemap[0]>(
    (locale) => {
      return {
        url: `${host}/${locale}/terms-and-conditions`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    },
  )
  const attractionProductsPromise = routing.locales.map<
    Promise<MetadataRoute.Sitemap>
  >(async (locale) => {
    const attractionProducts = await getAttractionProductsList(locale)
    const sitemap = attractionProducts.map<MetadataRoute.Sitemap[0]>(
      (attractionProduct) => {
        return {
          url: `${host}/${locale}/attraction-product/${attractionProduct.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
          images: [getFullMediaUrl(attractionProduct.photos[0])],
        }
      },
    )
    return sitemap
  })
  const attractionProductsResult = await Promise.all(attractionProductsPromise)
  const attractionProducts = attractionProductsResult.flatMap((dept) =>
    dept.flatMap((dest) => dest),
  )

  return [
    ...root,
    ...about,
    ...articles,
    ...articlesList,
    ...contactUs,
    ...privacyPolicy,
    ...termsAndConditions,
    ...attractionProducts,
  ]
}
