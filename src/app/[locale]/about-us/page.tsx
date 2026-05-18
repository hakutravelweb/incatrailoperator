import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { Localization } from '@/shared/interfaces'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { ButtonLink } from '@/components/ui/button'

const localizations = locales.map((locale): Localization => {
  return {
    locale,
    slug: '/about-us',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AboutUs')

  return {
    metadataBase: new URL(process.env.APP_URL!),
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
      images: [`/posters/banner.jpg`],
    },
  }
}

export default async function AboutUs() {
  const t = await getTranslations('AboutUs')

  return (
    <Layout localizations={localizations}>
      <div className='flex flex-col gap-10'>
        <div className='bg-abstract-navy py-20'>
          <Section>
            <div className='flex flex-col items-center gap-4 text-center'>
              <div className='bg-cayenne-red animate-bounce rounded-full border-2 border-white px-4 py-2 text-base leading-5 font-medium text-white'>
                {t('slogan')}
              </div>
              <span className='text-2xl leading-8 font-bold text-white'>
                {t('title')}
              </span>
              <span className='text-base leading-6 text-white'>
                {t('description')}
              </span>
              <div className='flex flex-wrap items-center justify-center gap-2'>
                <div className='rounded-full border-2 border-white px-4 py-2 text-base leading-5 font-medium text-white'>
                  {t('labels.label-1')}
                </div>
                <div className='rounded-full border-2 border-white px-4 py-2 text-base leading-5 font-medium text-white'>
                  {t('labels.label-2')}
                </div>
                <div className='rounded-full border-2 border-white px-4 py-2 text-base leading-5 font-medium text-white'>
                  {t('labels.label-3')}
                </div>
              </div>
            </div>
          </Section>
        </div>
        <Section>
          <div className='border-faded-white flex flex-col items-center gap-4 rounded-2xl border bg-white p-10 text-center'>
            <div className='bg-cayenne-red flex size-10 items-center justify-center rounded-full shadow-sm'>
              🇵🇪
            </div>
            <span className='text-2xl leading-8 font-bold'>
              {t('proudly-peruvian.title')}
            </span>
            <div className='bg-cayenne-red rounded-full px-4 py-2 text-base leading-5 font-medium text-white'>
              {t('proudly-peruvian.slogan')}
            </div>
            <span className='text-base leading-6'>
              {t('proudly-peruvian.description')}
            </span>
            <div className='flex flex-wrap justify-center gap-6'>
              <div className='border-faded-white flex flex-col gap-2 rounded-xl border bg-white p-6 text-center'>
                <span className='text-3xl leading-8'>🏔️</span>
                <span className='text-base leading-5 font-bold'>
                  {t('proudly-peruvian.features.feature-1.title')}
                </span>
                <span className='text-sm leading-4.5'>
                  {t('proudly-peruvian.features.feature-1.description')}
                </span>
              </div>
              <div className='border-faded-white flex flex-col gap-2 rounded-xl border bg-white p-6 text-center'>
                <span className='text-3xl leading-8'>🌾</span>
                <span className='text-base leading-5 font-bold'>
                  {t('proudly-peruvian.features.feature-2.title')}
                </span>
                <span className='text-sm leading-4.5'>
                  {t('proudly-peruvian.features.feature-2.description')}
                </span>
              </div>
              <div className='border-faded-white flex flex-col gap-2 rounded-xl border bg-white p-6 text-center'>
                <span className='text-3xl leading-8'>🎭</span>
                <span className='text-base leading-5 font-bold'>
                  {t('proudly-peruvian.features.feature-3.title')}
                </span>
                <span className='text-sm leading-4.5'>
                  {t('proudly-peruvian.features.feature-3.description')}
                </span>
              </div>
            </div>
          </div>
        </Section>
        <div className='bg-camouflage-blue py-10'>
          <Section>
            <div className='flex flex-col items-center gap-4'>
              <span className='text-2xl leading-8 font-bold text-white'>
                {t('we-are-locals.title')}
              </span>
              <span className='text-base leading-6 text-white'>
                {t('we-are-locals.subtitle')}
              </span>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='border-faded-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>💰</span>
                  <div className='flex flex-col gap-2'>
                    <span className='text-base leading-5 font-bold'>
                      {t('we-are-locals.features.feature-1.title')}
                    </span>
                    <span className='text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-1.description')}
                    </span>
                  </div>
                </div>
                <div className='border-faded-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>🤝</span>
                  <div className='flex flex-col gap-2'>
                    <span className='text-base leading-5 font-bold'>
                      {t('we-are-locals.features.feature-2.title')}
                    </span>
                    <span className='text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-2.description')}
                    </span>
                  </div>
                </div>
                <div className='border-faded-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>🏠</span>
                  <div className='flex flex-col gap-2'>
                    <span className='text-base leading-5 font-bold'>
                      {t('we-are-locals.features.feature-3.title')}
                    </span>
                    <span className='text-sm leading-4.5'>
                      {t('we-are-locals.features.feature-3.description')}
                    </span>
                  </div>
                </div>
                <div className='border-faded-white flex items-start gap-2 rounded-lg border bg-white p-6'>
                  <span className='text-5xl leading-10'>🌱</span>
                  <div className='flex flex-col gap-2'>
                    <span className='text-base leading-5 font-bold'>
                      {t('we-are-locals.features.feature-4.title')}
                    </span>
                    <span className='text-sm leading-4.5'>
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
            <div className='border-faded-white flex flex-col gap-2 rounded-lg border bg-white p-6'>
              <span className='text-5xl leading-10'>🎯</span>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <span className='text-base leading-5 font-bold'>
                    {t('our-mission.title')}
                  </span>
                  <div className='bg-dark-jade h-1 w-10' />
                </div>
                <span className='text-sm leading-4.5'>
                  {t('our-mission.description')}
                </span>
              </div>
            </div>
            <div className='border-faded-white flex flex-col gap-2 rounded-lg border bg-white p-6'>
              <span className='text-5xl leading-10'>🔭</span>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <span className='text-base leading-5 font-bold'>
                    {t('our-vision.title')}
                  </span>
                  <div className='bg-inferno h-1 w-10' />
                </div>
                <span className='text-sm leading-4.5'>
                  {t('our-vision.description-1')}
                </span>
                <span className='text-sm leading-4.5'>
                  {t('our-vision.description-2')}
                </span>
              </div>
            </div>
          </div>
        </Section>
        <div className='bg-bright-grey py-10'>
          <Section>
            <div className='flex flex-col items-center gap-4'>
              <div className='bg-cayenne-red rounded-full px-4 py-2 text-base leading-5 font-medium text-white'>
                {t('why-choose-us.slogan')}
              </div>
              <span className='text-2xl leading-7.25 font-bold'>
                {t('why-choose-us.title')}
              </span>
              <span className='text-base leading-6'>
                {t('why-choose-us.subtitle')}
              </span>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                <div className='border-faded-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>🏠</span>
                  <span className='text-base leading-5 font-bold'>
                    {t('why-choose-us.features.feature-1.title')}
                  </span>
                  <span className='text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-1.description')}
                  </span>
                </div>
                <div className='border-faded-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>👥</span>
                  <span className='text-base leading-5 font-bold'>
                    {t('why-choose-us.features.feature-2.title')}
                  </span>
                  <span className='text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-2.description')}
                  </span>
                </div>
                <div className='border-faded-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>💚</span>
                  <span className='text-base leading-5 font-bold'>
                    {t('why-choose-us.features.feature-3.title')}
                  </span>
                  <span className='text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-3.description')}
                  </span>
                </div>
                <div className='border-faded-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>🌱</span>
                  <span className='text-base leading-5 font-bold'>
                    {t('why-choose-us.features.feature-4.title')}
                  </span>
                  <span className='text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-4.description')}
                  </span>
                </div>
                <div className='border-faded-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>🎯</span>
                  <span className='text-base leading-5 font-bold'>
                    {t('why-choose-us.features.feature-5.title')}
                  </span>
                  <span className='text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-5.description')}
                  </span>
                </div>
                <div className='border-faded-white flex flex-col gap-4 rounded-lg border bg-white p-6'>
                  <span className='text-4xl leading-9'>📞</span>
                  <span className='text-base leading-5 font-bold'>
                    {t('why-choose-us.features.feature-6.title')}
                  </span>
                  <span className='text-sm leading-4.5'>
                    {t('why-choose-us.features.feature-6.description')}
                  </span>
                </div>
              </div>
            </div>
          </Section>
        </div>
        <div className='bg-dark-jade py-10'>
          <Section>
            <div className='flex flex-col items-center gap-6'>
              <div className='text-dark-jade rounded-full bg-white px-4 py-2 text-base leading-5 font-medium'>
                {t('start-adventure.slogan')}
              </div>
              <span className='text-2xl leading-7.25 font-bold text-white'>
                {t('start-adventure.title')}
              </span>
              <span className='text-base leading-6 text-white'>
                {t('start-adventure.description')}
              </span>
              <ButtonLink variant='secondary' widthFit href='/'>
                {t('start-adventure.explore-journeys')}
              </ButtonLink>
            </div>
          </Section>
        </div>
      </div>
    </Layout>
  )
}
