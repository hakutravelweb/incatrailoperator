import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { AttractionProduct } from '@/interfaces/attraction-product'

interface Props {
  attractionProduct: AttractionProduct
}

export function AttractionProductVerticalCard({ attractionProduct }: Props) {
  const locale = useLocale()
  const t = useTranslations('AttractionProductVerticalCard')

  return (
    <Link
      href={`/attraction-product/${attractionProduct.slug}`}
      className='border-anti-flash-white grid grid-cols-1 rounded-xl border-2 bg-white md:grid-cols-[35%_1fr]'
    >
      <div className='bg-anti-flash-white relative overflow-hidden rounded-t-xl max-md:aspect-video md:rounded-t-none md:rounded-l-xl'>
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
      <div className='flex flex-col items-start gap-2 px-4 py-2'>
        <span className='text-strong-dark-green text-sm leading-4.5 font-medium'>
          {attractionProduct.category.title}
        </span>
        <strong className='text-base leading-5 font-bold'>
          {attractionProduct.title}
        </strong>
        <div className='flex items-center gap-1'>
          <Icons.Location className='text-observatory size-4' />
          <span className='text-dark-charcoal text-sm leading-4.5'>
            {attractionProduct.destination.title},{' '}
            {attractionProduct.destination.department}
          </span>
        </div>
        <span className='text-dark-charcoal line-clamp-2 text-sm leading-4.5'>
          {attractionProduct.about}
        </span>
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
          <div className='bg-observatory flex items-center gap-2 rounded-md p-2'>
            <Icons.Check className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
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
        {attractionProduct.refundable.quantity === 0 ? (
          <div className='bg-ue-red flex items-center gap-2 rounded-md p-2'>
            <Icons.Close className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
              {t('not-refundable')}
            </span>
          </div>
        ) : (
          <div className='bg-blue-green flex items-center gap-2 rounded-md p-2'>
            <Icons.Check className='size-4 text-white' />
            <span className='flex-1 text-xs leading-4 font-medium text-white'>
              {t('refundable', {
                duration:
                  attractionProduct.refundable.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: attractionProduct.refundable.quantity,
                      })
                    : t('duration-days', {
                        quantity: attractionProduct.refundable.quantity,
                      }),
              })}
            </span>
          </div>
        )}
        <div className='flex w-full items-center justify-between gap-4'>
          <div className='flex items-center gap-1'>
            <Icons.Star className='text-yellow-sea size-4' />
            <span className='text-dark-charcoal text-sm leading-4.5 font-medium'>
              {attractionProduct.rating.toFixed(1)}
            </span>
            <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
              ({attractionProduct.reviewsCount})
            </span>
          </div>
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
        </div>
      </div>
    </Link>
  )
}
