import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Destination } from '@/interfaces/attraction-product'

interface Props {
  destination: Destination
}

export function DestinationCard({ destination }: Props) {
  const locale = useLocale()
  const t = useTranslations('DestinationCard')

  return (
    <div className='outline-anti-flash-white border-anti-flash-white overflow-hidden rounded-xl border-2 bg-white outline-2 outline-offset-4'>
      <div className='bg-anti-flash-white aspect-video'>
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
        <strong className='text-base leading-5 font-bold'>
          {destination.title}
        </strong>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Icons.Location className='size-4' />
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {destination.department}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <Icons.Star className='text-yellow-sea size-4' />
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {destination.rating?.toFixed(1) ?? '0.0'} / 5
            </span>
          </div>
          <div className='flex items-center gap-1'>
            <Icons.Persons className='size-4' />
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('travellers-number', {
                number: destination.travellersCount ?? 0,
              })}
            </span>
          </div>
        </div>
        <span className='text-dark-charcoal text-sm leading-4.5'>
          {destination.about}
        </span>
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-px'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('from-price')}
            </span>
            <span className='text-observatory text-base leading-5 font-bold'>
              {formatPrice(locale, destination.lowestPrice ?? 0)}
            </span>
          </div>
          <Link
            href='/filters-attraction-products'
            className='hover:bg-dark-charcoal active:bg-dav-ys-grey rounded-full bg-black px-4 py-2.5 text-sm leading-4.5 font-bold text-white transition-colors duration-100 active:text-white/50'
          >
            {t('see-attractions')}
          </Link>
        </div>
      </div>
    </div>
  )
}
