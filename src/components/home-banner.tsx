import { getLocale } from 'next-intl/server'
import { getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { getHomeLocale } from '@/services/home'
import { Section } from './section'

export async function HomeBanner() {
  const locale = await getLocale()
  const home = await getHomeLocale(locale)

  return (
    <div className='relative flex h-100 items-center justify-center bg-black'>
      <div className='bg-gradient-shadow absolute inset-0 z-1' />
      <img
        className='absolute size-full object-cover object-center'
        src={getFullMediaUrl(home.photo)}
        loading='lazy'
      />
      <Section>
        <div className='relative z-2 flex flex-col items-center gap-6 text-center'>
          <strong className='text-4xl leading-10 font-black text-white'>
            {home.title}
          </strong>
          <span className='text-xl leading-6 font-medium text-white'>
            {home.subtitle}
          </span>
          <Link
            href={home.link.href}
            target='_blank'
            className='not-disabled:bg-inferno not-disabled:hover:bg-outrageous-orange not-disabled:active:bg-cinnabar rounded-full px-6 py-3.5 text-base leading-5 font-bold text-white transition-colors duration-100'
          >
            {home.link.label}
          </Link>
        </div>
      </Section>
    </div>
  )
}

export function HomeBannerSkeleton() {
  return <div className='bg-chinese-white h-100 w-full animate-pulse' />
}
