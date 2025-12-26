'use client'
import { useTranslations } from 'next-intl'
import { locales } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/routing'
import { Localization } from '@/interfaces/root'
import { Layout } from '@/components/layout'
import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const t = useTranslations('NotFound')
  const pathname = usePathname()
  const router = useRouter()

  const localizations = locales.map<Localization>((locale) => {
    return {
      locale,
      slug: pathname,
    }
  })

  const handleNavigate = (route: string) => () => {
    router.replace(route)
  }

  return (
    <Layout localizations={localizations}>
      <Section>
        <div className='mx-auto flex flex-col gap-8 px-4 py-10 lg:w-2/6 lg:gap-10 lg:py-6'>
          <div className='flex flex-col items-center gap-4'>
            <h1 className='text-center text-[28px] leading-7.75 font-black lg:text-[44px] lg:leading-12 xl:text-[62px] xl:leading-17'>
              {t('title')}
            </h1>
            <p className='text-dark-charcoal text-xl leading-6 font-medium'>
              {t('description')}
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            <Button variant='primary' onClick={handleNavigate('/')}>
              {t('destinatons')}
            </Button>
            <Button onClick={handleNavigate('/')}>{t('travel')}</Button>
          </div>
        </div>
      </Section>
    </Layout>
  )
}
