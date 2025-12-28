import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/config'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { SignIn } from '@/components/signin'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('AuthSignIn')

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

export default async function AuthSignIn() {
  const t = await getTranslations('AuthSignIn')

  const localizations = locales.map<Localization>((locale) => {
    return {
      locale,
      slug: '/auth/signin',
    }
  })

  return (
    <Layout localizations={localizations}>
      <Section>
        <div className='flex flex-col gap-6 py-20'>
          <h1 className='text-3xl leading-9 font-extrabold'>{t('title')}</h1>
          <SignIn />
        </div>
      </Section>
    </Layout>
  )
}
