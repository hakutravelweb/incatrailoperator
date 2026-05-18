import { getLocale, getTranslations } from 'next-intl/server'
import { getJourneyPackages } from '@/services/journey'
import { JourneyPackageCard } from './journey-package-card'

export async function Packages() {
  const locale = await getLocale()
  const t = await getTranslations('Packages')
  const journeys = await getJourneyPackages(locale)

  return (
    <div className='flex flex-col items-center gap-6 py-10'>
      <div className='flex flex-col items-center gap-2'>
        <span className='text-2xl leading-7.25 font-bold'>{t('title')}</span>
        <span className='text-base leading-5.5'>{t('description')}</span>
      </div>
      {journeys.length === 0 && (
        <div className='flex justify-center py-4'>
          <span className='text-nevada text-sm leading-4.5'>
            {t('empty-message')}
          </span>
        </div>
      )}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {journeys.map((journey) => {
          return <JourneyPackageCard key={journey.id} journey={journey} />
        })}
      </div>
    </div>
  )
}

export function PackagesSkeleton() {
  return <div className='bg-bright-grey my-10 h-50 w-full animate-pulse' />
}
