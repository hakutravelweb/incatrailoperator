import { getLocale, getTranslations } from 'next-intl/server'
import { getDestinationsPerDepartment } from '@/services/destination'
import { DestinationCard } from './destination-card'

export async function DestinationsPerDepartment() {
  const locale = await getLocale()
  const t = await getTranslations('DestinationsPerDepartment')
  const destinationsPerDepartment = await getDestinationsPerDepartment(locale)

  return (
    <div className='flex flex-col gap-6 py-10'>
      <strong className='text-2xl leading-7.25'>{t('title')}</strong>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {destinationsPerDepartment.map((destination) => {
          return (
            <DestinationCard key={destination.id} destination={destination} />
          )
        })}
      </div>
    </div>
  )
}

export function DestinationsPerDepartmentSkeleton() {
  return <div className='bg-chinese-white my-10 h-50 w-full animate-pulse' />
}
