'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Section } from './section'
import { Icons } from '@/icons/icon'

export function Header() {
  const isMobile = useMediaQuery('max-w', 1024)

  return (
    <header className='border-b-chinese-white border-b bg-white'>
      <Section>
        <nav className='flex min-h-15 items-center justify-between gap-4 md:gap-6'>
          <Link href='/'>
            <img
              className={cn('h-full w-18.75 md:w-25', {
                'size-8': isMobile,
              })}
              src={isMobile ? '/logos/logo.svg' : '/logos/wordmark.svg'}
              alt='Inka Jungle'
              loading='lazy'
            />
          </Link>
          <div className='hover:bg-anti-flash-white active:bg-chinese-white active:text-dav-ys-grey flex cursor-pointer items-center justify-center rounded-full bg-white px-4 py-3.5'>
            <Icons.Language />
            <span className='text-sm leading-4.5 font-medium'>Español</span>
          </div>
        </nav>
      </Section>
    </header>
  )
}
