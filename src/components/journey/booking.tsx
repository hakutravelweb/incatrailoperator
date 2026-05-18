'use client'
import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  calculatePercentageDifference,
  cn,
  formatPrice,
  getFullMediaUrl,
} from '@/lib/utils'
import { Journey } from '@/interfaces/journey'
import { Button, ButtonLink } from '@/components/ui/button'

interface Props {
  journey: Journey
}

export function Booking({ journey }: Props) {
  const locale = useLocale()
  const t = useTranslations('Journey')
  const percentage = calculatePercentageDifference(
    journey.retailPrice,
    journey.specialPrice,
  )

  return (
    <div className='border-faded-white sticky top-2 flex flex-col gap-4 rounded-2xl border bg-white px-4 py-6'>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-col'>
          <span className='text-nevada text-base leading-5.5'>{t('from')}</span>
          <span
            className={cn('text-2xl leading-7.5 font-bold', {
              'text-base leading-5.5 font-medium line-through':
                journey.specialPrice > 0,
            })}
          >
            {formatPrice(locale, journey.retailPrice)}
          </span>
          {journey.specialPrice > 0 && (
            <span className='text-cayenne-red text-2xl leading-7.5 font-bold'>
              {formatPrice(locale, journey.specialPrice)}
            </span>
          )}
        </div>
        {percentage > 0 && (
          <span className='bg-cayenne-red rounded-sm px-2 py-1 text-sm leading-5 font-medium text-white'>
            {t('you-save-percent', {
              percentage,
            })}
          </span>
        )}
      </div>
      {journey.specialPrice > 0 && (
        <span className='text-dark-jade text-base leading-5.5 font-medium'>
          {t('save-money', {
            amount: formatPrice(
              locale,
              journey.retailPrice - journey.specialPrice,
            ),
          })}
        </span>
      )}
      <div className='flex flex-col gap-2'>
        {journey.codeWetravel && (
          <PaymentButton codWetravel={journey.codeWetravel} />
        )}
        <div
          className={cn('grid grid-cols-1 gap-2', {
            'grid-cols-2': journey.pdfItinerary,
          })}
        >
          {journey.pdfItinerary && (
            <ButtonLink
              variant='secondary'
              href={getFullMediaUrl(journey.pdfItinerary)}
            >
              {t('download-pdf')}
            </ButtonLink>
          )}
          <ButtonLink
            variant='outline'
            icon='Whatsapp'
            href='https://api.whatsapp.com/send/?phone=+51984259412&text=%C2%A1Hola!,%20necesito%20mas%20informaci%C3%B3n...'
          >
            {t('contact')}
          </ButtonLink>
        </div>
      </div>
      <hr className='border-bright-grey border-t' />
      <div className='flex flex-col py-2'>
        <span className='text-sm leading-5 font-medium'>
          {t('general-information.cancellation-policy')}
        </span>
        <span className='text-nevada text-sm leading-5'>
          {journey.freeCancellation.quantity === 0
            ? t('general-information.cancellation-policy-not-refound')
            : t('general-information.refundable', {
                duration:
                  journey.duration.type === 'HOUR'
                    ? t('duration-hours', {
                        quantity: journey.duration.quantity,
                      })
                    : t('duration-days', {
                        quantity: journey.duration.quantity,
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
  const t = useTranslations('Journey')

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

  return <Button onClick={handleWeTravel}>{t('book-now')}</Button>
}
