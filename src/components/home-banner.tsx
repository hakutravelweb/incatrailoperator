import { getLocale } from 'next-intl/server'
import { getFullMediaUrl } from '@/lib/utils'
import { getHomeLocale } from '@/services/home'
import { Section } from './section'
import { ButtonLink } from './ui/button'

export async function HomeBanner() {
  const locale = await getLocale()
  const home = await getHomeLocale(locale)

  return (
    <div className='bg-abstract-navy relative flex h-100 items-center justify-center'>
      <div className='bg-gradient-shadow absolute inset-0 z-1' />
      <img
        className='absolute size-full object-cover object-center'
        src={getFullMediaUrl(home.photo)}
        loading='lazy'
      />
      <Section>
        <div className='relative z-2 flex flex-col items-center gap-6 text-center'>
          <span className='text-4xl leading-10 font-bold text-white'>
            {home.title}
          </span>
          <span className='text-xl leading-6 font-medium text-white'>
            {home.subtitle}
          </span>
          <ButtonLink variant='secondary' widthFit href={home.resource.url}>
            {home.resource.text}
          </ButtonLink>
        </div>
      </Section>
    </div>
  )
}

export function HomeBannerSkeleton() {
  return <div className='bg-bright-grey h-100 w-full' />
}
