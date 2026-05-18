import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/shared/interfaces'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Contact } from '@/components/contact'
import { InformationContact } from '@/components/information-contact'
import { CompanyHours } from '@/components/company-hours'

const localizations = locales.map((locale): Localization => {
  return {
    locale,
    slug: '/contact-us',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ContactUs')

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

export default async function ContactUs() {
  const t = await getTranslations('ContactUs')

  return (
    <Layout localizations={localizations}>
      <div className='bg-bright-grey flex flex-col gap-10 py-20'>
        <Section>
          <div className='flex flex-col items-center gap-2 text-center'>
            <span className='text-2xl leading-6 font-bold'>{t('title')}</span>
            <span className='text-base leading-5.5'>{t('description')}</span>
          </div>
        </Section>
        <Section>
          <div className='grid gap-10 md:grid-cols-2'>
            <div className='border-faded-white flex flex-col gap-6 rounded-2xl border bg-white p-6'>
              <span className='text-lg leading-6 font-bold'>
                {t('contact.title')}
              </span>
              <Contact />
            </div>
            <div className='border-faded-white flex flex-col gap-6 rounded-2xl border bg-white p-6'>
              <span className='text-lg leading-6 font-bold'>
                {t('information.title')}
              </span>
              <InformationContact />
            </div>
          </div>
        </Section>
        <Section>
          <CompanyHours />
        </Section>
      </div>
    </Layout>
  )
}
