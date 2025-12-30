import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'

const localizations = locales.map<Localization>((locale) => {
  return {
    locale,
    slug: '/about-us',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AboutUs')

  return {
    title: t('metadata.title'),
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: t('metadata.title'),
    },
  }
}

export default async function AboutUs() {
  const t = await getTranslations('AboutUs')

  return (
    <Layout localizations={localizations}>
      <div className='flex flex-col gap-10'>
        <div className='bg-strong-dark-green py-20'>
          <Section>
            <div className='flex flex-col items-center gap-4 text-center'>
              <div className='bg-ue-red animate-bounce rounded-full border-2 border-white px-4 py-2 text-base leading-5 font-medium text-white'>
                {t('slogan')}
              </div>
              <strong className='text-2xl leading-8 font-black text-white'>
                {t('title')}
              </strong>
              <span className='text-base leading-6 text-white'>
                {t('description')}
              </span>
              <div className='flex flex-wrap items-center justify-center gap-2'>
                <div className='rounded-full border-2 border-white bg-white/20 px-4 py-2 text-base leading-5 font-medium text-white'>
                  {t('labels.label-1')}
                </div>
                <div className='rounded-full border-2 border-white bg-white/20 px-4 py-2 text-base leading-5 font-medium text-white'>
                  {t('labels.label-2')}
                </div>
                <div className='rounded-full border-2 border-white bg-white/20 px-4 py-2 text-base leading-5 font-medium text-white'>
                  {t('labels.label-3')}
                </div>
              </div>
            </div>
          </Section>
        </div>
        <Section>
          <div className='bg-anti-flash-white shadow-soft-drop flex flex-col items-center gap-4 rounded-xl p-10 text-center'>
            <div className='bg-ue-red shadow-yellow-sea flex size-10 items-center justify-center rounded-full shadow-sm'>
              🇵🇪
            </div>
            <strong className='text-2xl leading-8 font-black'>
              {t('proudly-peruvian.title')}
            </strong>
            <div className='bg-ue-red rounded-full px-4 py-2 text-base leading-5 font-medium text-white'>
              {t('proudly-peruvian.slogan')}
            </div>
            <span className='text-base leading-6'>
              {t('proudly-peruvian.description')}
            </span>
            <div className='flex flex-wrap justify-center gap-6'>
              <div className='border-chinese-white flex flex-col gap-2 rounded-xl border bg-white p-6 text-center'>
                <span className='text-3xl leading-8'>🏔️</span>
                <strong className='text-base leading-5'>
                  {t('proudly-peruvian.features.feature-1.title')}
                </strong>
                <span className='text-dark-charcoal text-sm leading-4.5'>
                  {t('proudly-peruvian.features.feature-1.description')}
                </span>
              </div>
              <div className='border-chinese-white flex flex-col gap-2 rounded-xl border bg-white p-6 text-center'>
                <span className='text-3xl leading-8'>🌾</span>
                <strong className='text-base leading-5'>
                  {t('proudly-peruvian.features.feature-2.title')}
                </strong>
                <span className='text-dark-charcoal text-sm leading-4.5'>
                  {t('proudly-peruvian.features.feature-2.description')}
                </span>
              </div>
              <div className='border-chinese-white flex flex-col gap-2 rounded-xl border bg-white p-6 text-center'>
                <span className='text-3xl leading-8'>🎭</span>
                <strong className='text-base leading-5'>
                  {t('proudly-peruvian.features.feature-3.title')}
                </strong>
                <span className='text-dark-charcoal text-sm leading-4.5'>
                  {t('proudly-peruvian.features.feature-3.description')}
                </span>
              </div>
            </div>
          </div>
        </Section>
        <div className='bg-anti-flash-white py-10'>
          <Section>
            <div className='flex flex-col items-center gap-4'>
              <strong className='text-2xl leading-8 font-black'>
                {t('we-are-locals.title')}
              </strong>
              <span className='text-base leading-6'>
                {t('we-are-locals.subtitle')}
              </span>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='border-chinese-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>💰</span>
                  <div className='flex flex-col gap-2'>
                    <strong className='text-base leading-5'>
                      {t('we-are-locals.features.feature-1.title')}
                    </strong>
                    <span className='text-dark-charcoal text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-1.description')}
                    </span>
                  </div>
                </div>
                <div className='border-chinese-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>🤝</span>
                  <div className='flex flex-col gap-2'>
                    <strong className='text-base leading-5'>
                      {t('we-are-locals.features.feature-2.title')}
                    </strong>
                    <span className='text-dark-charcoal text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-2.description')}
                    </span>
                  </div>
                </div>
                <div className='border-chinese-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>🏠</span>
                  <div className='flex flex-col gap-2'>
                    <strong className='text-base leading-5'>
                      {t('we-are-locals.features.feature-3.title')}
                    </strong>
                    <span className='text-dark-charcoal text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-3.description')}
                    </span>
                  </div>
                </div>
                <div className='border-chinese-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>🌱</span>
                  <div className='flex flex-col gap-2'>
                    <strong className='text-base leading-5'>
                      {t('we-are-locals.features.feature-4.title')}
                    </strong>
                    <span className='text-dark-charcoal text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-4.description')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
        <Section>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='border-chinese-white flex flex-col gap-2 rounded-lg border bg-white p-6'>
              <span className='text-5xl leading-10'>🎯</span>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <strong className='text-base leading-5'>
                    {t('our-mission.title')}
                  </strong>
                  <div className='bg-blue-green h-1 w-10' />
                </div>
                <span className='text-dark-charcoal text-sm leading-4.5'>
                  {t('our-mission.description')}
                </span>
              </div>
            </div>
            <div className='border-chinese-white flex flex-col gap-2 rounded-lg border bg-white p-6'>
              <span className='text-5xl leading-10'>🔭</span>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <strong className='text-base leading-5'>
                    {t('our-vision.title')}
                  </strong>
                  <div className='bg-yellow-sea h-1 w-10' />
                </div>
                <span className='text-dark-charcoal text-sm leading-4.5'>
                  {t('our-vision.description-1')}
                </span>
                <span className='text-dark-charcoal text-sm leading-4.5'>
                  {t('our-vision.description-2')}
                </span>
              </div>
            </div>
          </div>
        </Section>
        <div className='bg-anti-flash-white py-10'>
          <Section>
            <div className='flex flex-col items-center gap-4'>
              <div className='bg-ue-red rounded-full px-4 py-2 text-base leading-5 font-medium text-white'>
                {t('why-choose-us.slogan')}
              </div>
              <strong className='text-2xl leading-7.25 font-black'>
                {t('why-choose-us.title')}
              </strong>
              <span className='text-dark-charcoal text-base leading-6'>
                {t('why-choose-us.subtitle')}
              </span>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <div className='border-chinese-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>🏠</span>
                  <strong className='text-base leading-5'>
                    {t('why-choose-us.features.feature-1.title')}
                  </strong>
                  <span className='text-dark-charcoal text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-1.description')}
                  </span>
                </div>
                <div className='border-chinese-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>👥</span>
                  <strong className='text-base leading-5'>
                    {t('why-choose-us.features.feature-2.title')}
                  </strong>
                  <span className='text-dark-charcoal text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-2.description')}
                  </span>
                </div>
                <div className='border-chinese-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>💚</span>
                  <strong className='text-base leading-5'>
                    {t('why-choose-us.features.feature-3.title')}
                  </strong>
                  <span className='text-dark-charcoal text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-3.description')}
                  </span>
                </div>
                <div className='border-chinese-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>🌱</span>
                  <strong className='text-base leading-5'>
                    {t('why-choose-us.features.feature-4.title')}
                  </strong>
                  <span className='text-dark-charcoal text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-4.description')}
                  </span>
                </div>
                <div className='border-chinese-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>🎯</span>
                  <strong className='text-base leading-5'>
                    {t('why-choose-us.features.feature-5.title')}
                  </strong>
                  <span className='text-dark-charcoal text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-5.description')}
                  </span>
                </div>
                <div className='border-chinese-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>📞</span>
                  <strong className='text-base leading-5'>
                    {t('why-choose-us.features.feature-6.title')}
                  </strong>
                  <span className='text-dark-charcoal text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-6.description')}
                  </span>
                </div>
              </div>
            </div>
          </Section>
        </div>
        <div className='bg-strong-dark-green py-10'>
          <Section>
            <div className='flex flex-col items-center gap-6'>
              <div className='text-observatory rounded-full bg-white px-4 py-2 text-base leading-5 font-medium'>
                {t('start-adventure.slogan')}
              </div>
              <strong className='text-2xl leading-7.25 font-black text-white'>
                {t('start-adventure.title')}
              </strong>
              <span className='text-base leading-6 text-white'>
                {t('start-adventure.description')}
              </span>
              <Link
                href='/'
                className='bg-blue-green rounded-full px-4 py-2.5 text-center text-base leading-5 font-bold'
              >
                {t('start-adventure.explore-attractions')}
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  )
}
