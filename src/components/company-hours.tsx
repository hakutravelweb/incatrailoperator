import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'

export function CompanyHours() {
  const t = useTranslations('ContactUs')

  return (
    <div className='border-faded-white flex items-center justify-center gap-4 rounded-2xl border bg-white p-6'>
      <div className='bg-abstract-navy flex size-10 items-center justify-center rounded-full'>
        <Icons.Clock className='size-6 text-white' />
      </div>
      <div className='flex flex-col gap-4'>
        <span className='text-lg leading-6 font-bold'>
          {t('company-hours.title')}
        </span>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <span className='text-nevada text-sm leading-4.5'>
              {t('company-hours.time-one')}
            </span>
            <span className='text-nevada text-sm leading-4.5'>
              {t('company-hours.time-two')}
            </span>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-dark-jade text-sm leading-4.5'>
              {t('company-hours.emergency-24')}
            </span>
            <div className='flex items-center gap-1'>
              <span className='text-sm leading-4.5 font-medium'>
                {t('company-hours.whatsapp-phone')}
              </span>
              <span className='text-nevada text-sm leading-4.5'>
                +51 984 259 412
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
