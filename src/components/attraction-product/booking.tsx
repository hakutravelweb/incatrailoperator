'use client'
import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn, formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { AttractionProduct } from '@/interfaces/attraction-product'
import { Button } from '@/components/ui/button'
import { Rating } from './rating'
import { Icons } from '@/icons/icon'

interface Props {
  attractionProduct: AttractionProduct
}

export function Booking({ attractionProduct }: Props) {
  const locale = useLocale()
  const t = useTranslations('AttractionProduct')

  return (
    <div className='shadow-deep sticky top-2 flex flex-col gap-4 rounded-xl bg-white p-6'>
      <div className='flex items-center gap-2'>
        <Rating rating={attractionProduct.rating} />
        <span className='text-base leading-5 font-medium'>
          {attractionProduct.rating.toFixed(1)}
        </span>
        <span className='text-dav-ys-grey text-base leading-5'>
          (
          {t('reviews-count', {
            quantity: attractionProduct.reviewsCount,
          })}
          )
        </span>
      </div>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <span className='text-dav-ys-grey text-base leading-5 font-medium'>
            {t('from')}
          </span>
          <span
            className={cn('text-lg leading-5 font-bold', {
              'text-ue-red line-through': attractionProduct.specialPrice > 0,
            })}
          >
            {formatPrice(locale, attractionProduct.retailPrice)}
          </span>
          {attractionProduct.specialPrice > 0 && (
            <span className='text-lg leading-5 font-bold'>
              {formatPrice(locale, attractionProduct.specialPrice)}
            </span>
          )}
        </div>
        <span className='bg-ue-red rounded-md p-2 text-sm leading-4.5 font-medium text-white'>
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
      {attractionProduct.specialPrice > 0 && (
        <span className='text-inferno text-base leading-5 font-medium'>
          {t('save-money', {
            amount: formatPrice(
              locale,
              attractionProduct.retailPrice - attractionProduct.specialPrice,
            ),
          })}
        </span>
      )}
      <div className='flex flex-col gap-2'>
        {attractionProduct.codeWetravel && (
          <PaymentButton codWetravel={attractionProduct.codeWetravel} />
        )}
        <div className='grid grid-cols-2 items-center gap-2'>
          {attractionProduct.attractionPdf && (
            <Link
              className='hover:bg-dark-charcoal active:bg-dav-ys-grey rounded-full bg-black px-4 py-3.5 text-center text-base leading-5 font-bold text-white transition-colors duration-100 active:text-white/50'
              href={getFullMediaUrl(attractionProduct.attractionPdf)}
              target='_blank'
            >
              {t('download-pdf')}
            </Link>
          )}
          <Link
            className='hover:bg-anti-flash-white active:bg-chinese-white active:text-dav-ys-grey border-chinese-white flex items-center justify-center gap-2 rounded-full border-2 bg-white px-4 py-3 text-base leading-5 font-bold'
            href='https://api.whatsapp.com/send/?phone=+51984259412&text=%C2%A1Hola!,%20necesito%20mas%20informaci%C3%B3n...'
            target='_blank'
          >
            <Icons.Whatsapp className='size-5' />
            {t('contact')}
          </Link>
        </div>
      </div>
      <hr className='border-chinese-white border-t' />
      <div className='flex flex-col gap-1'>
        <strong className='text-base leading-5 font-medium'>
          {t('general-information.cancellation-policy')}
        </strong>
        <span className='text-dav-ys-grey text-base leading-5'>
          {attractionProduct.freeCancellation.quantity === 0
            ? t('general-information.cancellation-policy-not-refound')
            : t('general-information.refundable', {
                duration:
                  attractionProduct.duration.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: attractionProduct.duration.quantity,
                      })
                    : t('duration-days', {
                        quantity: attractionProduct.duration.quantity,
                      }),
              })}
        </span>
      </div>
    </div>
  )
}

interface PaymentButtonProps {
  codWetravel: string
}

function PaymentButton({ codWetravel }: PaymentButtonProps) {
  const t = useTranslations('AttractionProduct')

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event?.data === 'wtrvlCheckoutClosed') {
        const iframe = document.querySelector('.wtrvl-ifrm')
        if (iframe) {
          iframe.parentNode?.removeChild(iframe)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleWeTravel = () => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.width = '100vw'
    iframe.style.height = '100vh'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.style.bottom = '0'
    iframe.style.right = '0'
    iframe.style.zIndex = '21150313555'
    iframe.src = `https://www.wetravel.com/checkout_embed?uuid=${codWetravel}`
    iframe.className = 'wtrvl-ifrm'
    document.body.appendChild(iframe)
  }

  return (
    <Button variant='primary' onClick={handleWeTravel}>
      {t('book-now')}
    </Button>
  )
}
