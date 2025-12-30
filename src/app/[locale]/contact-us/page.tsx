import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Contact } from '@/components/contact'
import { InformationContact } from '@/components/information-contact'
import { CompanyHours } from '@/components/company-hours'

const localizations = locales.map<Localization>((locale) => {
  return {
    locale,
    slug: '/contact-us',
  }
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ContactUs')

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

export default async function ContactUs() {
  const t = await getTranslations('ContactUs')

  return (
    <Layout localizations={localizations}>
      <div className='bg-observatory flex flex-col gap-10 py-20'>
        <Section>
          <div className='flex flex-col items-center gap-2 text-center'>
            <strong className='text-2xl leading-7 font-black text-white'>
              {t('title')}
            </strong>
            <span className='text-base leading-5 font-medium text-white'>
              {t('description')}
            </span>
          </div>
        </Section>
        <Section>
          <div className='grid gap-10 md:grid-cols-2'>
            <div className='flex flex-col gap-6 rounded-xl bg-white p-6'>
              <strong className='text-lg leading-6'>
                {t('contact.title')}
              </strong>
              <Contact />
            </div>
            <div className='flex flex-col gap-6 rounded-xl bg-white p-6'>
              <strong className='text-lg leading-6'>
                {t('information.title')}
              </strong>
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
