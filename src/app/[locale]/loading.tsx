import { useTranslations } from 'next-intl'
import { Section } from '@/components/section'

export default function Loading() {
  const t = useTranslations('Loading')

  return (
    <div className='flex h-screen items-center'>
      <Section>
        <div className='flex flex-col items-center gap-6'>
          <span className='text-center text-2xl leading-7.25 font-bold'>
            {t('step-journey')}
          </span>
          <img
            className='max-w-20'
            src='/animations/ito-loader.gif'
            alt={t('step-journey')}
            loading='lazy'
          />
        </div>
      </Section>
    </div>
  )
}
