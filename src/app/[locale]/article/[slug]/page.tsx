import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getFullMediaUrl } from '@/lib/utils'
import { Locale } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { getArticleBySlug } from '@/services/article'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { ArticleHeader } from '@/components/article-header'
import { ParseHtml } from '@/components/parse-html'

interface Params {
  locale: Locale
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticleBySlug(locale, slug)

  return {
    title: article.title,
    description: article.introduction,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: article.title,
      description: article.introduction,
      images: [getFullMediaUrl(article.photo)],
    },
  }
}

export default async function AttractionProduct({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('Articles')
  const article = await getArticleBySlug(locale, slug)

  return (
    <Layout localizations={article.localizations}>
      <div className='flex flex-col gap-6 py-10'>
        <Section>
          <ArticleHeader article={article} />
        </Section>
        <div className='bg-strong-dark-green h-100'>
          <img
            className='size-full object-cover'
            src={getFullMediaUrl(article.photo)}
            alt={article.title}
            loading='lazy'
          />
        </div>
        <Section>
          <ParseHtml content={article.content} />
        </Section>
        <div className='bg-strong-dark-green py-10'>
          <Section>
            <div className='flex flex-col items-center gap-6'>
              <strong className='text-2xl leading-7.25 font-extrabold text-white'>
                {t('start-adventure.title')}
              </strong>
              <span className='text-base leading-6 text-white'>
                {t('start-adventure.description')}
              </span>
              <Link
                href='/'
                className='bg-blue-green rounded-full px-4 py-2.5 text-center text-base leading-5 font-bold'
              >
                {t('start-adventure.view-available-attractions')}
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  )
}
