import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Icons } from '@/icons/icon'
import { getFullMediaUrl } from '@/lib/utils'
import { Locale } from '@/i18n/config'
import { getAttractionProductBySlug } from '@/services/attraction-product'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { NewReview } from '@/components/attraction-product/new-review'

interface Params {
  locale: Locale
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations('AttractionProduct')
  const attractionProduct = await getAttractionProductBySlug(locale, slug)

  return {
    title: t('review.title', {
      title: attractionProduct.title,
    }),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: t('review.title', {
        title: attractionProduct.title,
      }),
      images: [getFullMediaUrl(attractionProduct.photos[0])],
    },
  }
}

export default async function AttractionProduct({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('AttractionProduct')
  const attractionProduct = await getAttractionProductBySlug(locale, slug)

  return (
    <Layout localizations={attractionProduct.localizations}>
      <div className='flex flex-col gap-6 py-10'>
        <Section>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col items-start gap-2'>
              <div className='border-chinese-white bg-anti-flash-white rounded-md border-2 px-2 py-1 text-sm leading-4.5 font-bold uppercase'>
                {t(`variant.${attractionProduct.variant}`)}
              </div>
              <strong className='text-2xl leading-7.25 font-extrabold md:text-[28px] md:leading-8.5'>
                {t('review.title', {
                  title: attractionProduct.title,
                })}
              </strong>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <div className='flex items-center gap-1'>
                <Icons.Location className='text-observatory size-5' />
                <span className='text-dark-charcoal text-base leading-5'>
                  {attractionProduct.destination.title}, {t('country')}
                </span>
              </div>
              <span className='text-gray-x11 text-base leading-5'>•</span>
              <div className='flex items-center gap-1'>
                <Icons.Clock className='text-observatory size-5' />
                <span className='text-dark-charcoal text-base leading-5'>
                  {attractionProduct.duration.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: attractionProduct.duration.quantity,
                      })
                    : t('duration-days', {
                        quantity: attractionProduct.duration.quantity,
                      })}
                </span>
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <NewReview attractionProduct={attractionProduct} />
        </Section>
      </div>
    </Layout>
  )
}
