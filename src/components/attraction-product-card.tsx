import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { AttractionProduct } from '@/interfaces/attraction-product'

interface Props {
  attractionProduct: AttractionProduct
}

export function AttractionProductCard({ attractionProduct }: Props) {
  const locale = useLocale()
  const t = useTranslations('AttractionProductCard')

  return (
    <div className='border-anti-flash-white rounded-xl border-2 bg-white'>
      <div className='bg-anti-flash-white relative aspect-video overflow-hidden rounded-t-xl'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(attractionProduct.photos[0])}
          alt={attractionProduct.title}
          loading='lazy'
        />
        <div className='absolute top-2 right-2'>
          <span className='bg-ue-red rounded-md p-2 text-xs leading-4 font-medium text-white'>
            {t('you-save-percent', {
              percentage: Math.round(
                ((attractionProduct.retailPrice -
                  attractionProduct.specialPrice) /
                  attractionProduct.retailPrice) *
                  100,
              ),
            })}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 px-4 py-2'>
        <div className='flex items-start gap-2'>
          <strong className='text-base leading-5 font-bold'>
            {attractionProduct.title}
          </strong>
          <div className='flex gap-1'>
            <Icons.Star className='text-blue-green size-4' />
            <span className='text-dark-charcoal text-sm leading-4.5 font-medium'>
              {attractionProduct.rating?.toFixed(1) || '0.0'}
            </span>
            <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
              ({attractionProduct.reviewsCount || 0})
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            <Icons.Clock className='text-dav-ys-grey size-4' />
            <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
              {attractionProduct.duration.type === 'HOUR'
                ? t('duration-hours', {
                    quantity: attractionProduct.duration.quantity,
                  })
                : t('duration-days', {
                    quantity: attractionProduct.duration.quantity,
                  })}
            </span>
          </div>
          <span className='text-gray-x11 text-base leading-4.75'>•</span>
          <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
            {attractionProduct.category}
          </span>
        </div>
        <span className='text-dav-ys-grey line-clamp-2 text-sm leading-4.5'>
          {attractionProduct.about}
        </span>
        {attractionProduct.labels.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {attractionProduct.labels.map((label, index) => (
              <div
                key={index}
                className='rounded-sm border border-black bg-white px-2 py-1 text-xs leading-4 font-medium'
              >
                {label}
              </div>
            ))}
          </div>
        )}
        {attractionProduct.freeCancellation.quantity > 0 && (
          <div className='bg-observatory/10 flex items-center gap-2 rounded-md px-2 py-1'>
            <Icons.Check className='text-strong-dark-green size-4' />
            <span className='text-strong-dark-green flex-1 text-xs leading-4 font-medium'>
              {t('free-cancellation', {
                duration:
                  attractionProduct.freeCancellation.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: attractionProduct.freeCancellation.quantity,
                      })
                    : t('duration-days', {
                        quantity: attractionProduct.freeCancellation.quantity,
                      }),
              })}
            </span>
          </div>
        )}
        <div className='flex items-center justify-between gap-4'>
          {attractionProduct.specialPrice > 0 ? (
            <div className='flex flex-col gap-px'>
              <span className='text-dav-ys-grey text-sm leading-4.5 line-through'>
                {formatPrice(locale, attractionProduct.retailPrice)}
              </span>
              <span className='text-dark-charcoal text-lg leading-6 font-bold'>
                {formatPrice(locale, attractionProduct.specialPrice)}
              </span>
            </div>
          ) : (
            <span className='text-dark-charcoal text-lg leading-6 font-bold'>
              {formatPrice(locale, attractionProduct.retailPrice)}
            </span>
          )}
          {attractionProduct.specialPrice > 0 && (
            <span className='bg-yellow-sea/20 text-dark-charcoal w-min rounded-md px-2 py-1 text-xs leading-4 font-medium'>
              {t('you-save', {
                amount: formatPrice(
                  locale,
                  attractionProduct.retailPrice -
                    attractionProduct.specialPrice,
                ),
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
