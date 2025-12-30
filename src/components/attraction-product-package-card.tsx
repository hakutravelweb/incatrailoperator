import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { AttractionProduct } from '@/interfaces/attraction-product'

interface Props {
  attractionProduct: AttractionProduct
}

export function AttractionProductPackageCard({ attractionProduct }: Props) {
  const locale = useLocale()
  const t = useTranslations('AttractionProductCard')

  return (
    <div className='border-anti-flash-white shadow-deep rounded-xl border-2 bg-white'>
      <div className='bg-anti-flash-white relative aspect-video overflow-hidden rounded-t-xl'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(attractionProduct.photos[0])}
          alt={attractionProduct.title}
          loading='lazy'
        />
        <div className='absolute bottom-4 left-2/4 z-1 flex -translate-x-2/4 items-center gap-1 rounded-full bg-white px-4 py-2'>
          <Icons.Clock className='size-5' />
          <span className='text-base leading-5 font-medium'>
            {attractionProduct.duration.type === 'HOUR'
              ? t('duration-hours', {
                  quantity: attractionProduct.duration.quantity,
                })
              : t('duration-days', {
                  quantity: attractionProduct.duration.quantity,
                })}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-4 p-6'>
        <strong className='text-lg leading-6'>{attractionProduct.title}</strong>
        <span className='text-dark-charcoal text-sm leading-4.5'>
          {attractionProduct.about}
        </span>
        <div className='bg-anti-flash-white grid grid-cols-2 gap-4 rounded-lg p-4'>
          {attractionProduct.includes.map((include, index) => {
            return (
              <div key={index} className='flex items-center gap-2'>
                <Icons.Check className='text-observatory size-5' />
                <span className='text-dark-charcoal flex-1 text-sm leading-4.5'>
                  {include}
                </span>
              </div>
            )
          })}
        </div>
        <hr className='border-chinese-white border-t' />
        <div className='flex items-center justify-between gap-4'>
          {attractionProduct.specialPrice > 0 ? (
            <div className='flex flex-col gap-px'>
              <span className='text-dav-ys-grey text-sm leading-4.5 line-through'>
                {formatPrice(locale, attractionProduct.retailPrice)}
              </span>
              <span className='text-dark-charcoal text-lg leading-6 font-bold'>
                {formatPrice(locale, attractionProduct.specialPrice)}
              </span>
              <span className='text-strong-dark-green text-sm leading-4.5'>
                {t('per-person')}
              </span>
            </div>
          ) : (
            <div className='flex flex-col gap-px'>
              <span className='text-dark-charcoal text-lg leading-6 font-bold'>
                {formatPrice(locale, attractionProduct.retailPrice)}
              </span>
              <span className='text-strong-dark-green text-sm leading-4.5'>
                {t('per-person')}
              </span>
            </div>
          )}
          <Link
            href={`/attraction-product/${attractionProduct.slug}`}
            className='hover:bg-blue-green active:bg-strong-dark-green bg-observatory rounded-full px-4 py-3 text-sm leading-4.5 font-bold text-white transition-colors duration-100 active:text-white/50'
          >
            {t('see-itinerary')}
          </Link>
        </div>
      </div>
    </div>
  )
}
