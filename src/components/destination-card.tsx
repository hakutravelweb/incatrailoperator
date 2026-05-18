import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Destination } from '@/interfaces/journey'
import { ButtonLink } from './ui/button'

interface Props {
  destination: Destination
}

export function DestinationCard({ destination }: Props) {
  const locale = useLocale()
  const t = useTranslations('DestinationCard')

  return (
    <div className='border-faded-white overflow-hidden rounded-2xl border bg-white'>
      <div className='bg-bright-grey aspect-video'>
        {destination.photo && (
          <img
            className='size-full object-cover'
            src={getFullMediaUrl(destination.photo)}
            alt={destination.title}
            loading='lazy'
          />
        )}
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <span className='text-base leading-5.5 font-medium'>
          {destination.title}
        </span>
        <div className='flex items-center gap-4'>
          <span className='text-nevada text-sm leading-4.5'>
            {destination.department}
          </span>
          <div className='flex items-center gap-1'>
            <Icons.Star className='size-4' />
            <span className='text-nevada text-sm leading-4.5'>
              {destination.rating.toFixed(1)} / 5
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <Icons.Persons className='size-4' />
            <span className='text-nevada text-sm leading-4.5'>
              {t('travellers-number', {
                number: destination.travellersCount,
              })}
            </span>
          </div>
        </div>
        <span className='text-sm leading-4.5'>{destination.about}</span>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col'>
            <span className='text-nevada text-sm leading-4.5'>
              {t('from-price')}
            </span>
            <span className='text-cayenne-red text-base leading-5.5 font-medium'>
              {formatPrice(locale, destination.lowestPrice)}
            </span>
          </div>
          <ButtonLink widthFit href={`/destination/${destination.slug}`}>
            {t('see-journeys')}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
