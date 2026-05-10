import { Metadata } from 'next'
import { Locale } from '@/i18n/config'
import { getDestinationBySlug } from '@/services/destination'
import { Layout } from '@/components/layout'
import { JourneysDestination } from '@/components/journeys-destination'

interface Params {
  locale: Locale
  slug: string
}

interface Props {
  params: Promise<Params>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const destination = await getDestinationBySlug(locale, slug)

  return {
    title: destination.title,
    description: destination.about,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      title: destination.title,
      description: destination.about,
    },
  }
}

export default async function Destination({ params }: Props) {
  const { locale, slug } = await params
  const destination = await getDestinationBySlug(locale, slug)

  return (
    <Layout localizations={destination.localizations}>
      <JourneysDestination destination={destination} />
    </Layout>
  )
}
