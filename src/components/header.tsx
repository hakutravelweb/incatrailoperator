'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Link, useRouter } from '@/i18n/routing'
import { Localization } from '@/interfaces/root'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Section } from './section'
import { Modal } from './ui/modal'

interface Props {
  localizations: Localization[]
}

export function Header({ localizations }: Props) {
  const locale = useLocale()
  const t = useTranslations('Language')
  const router = useRouter()
  const isMobile = useMediaQuery('max-w', 1024)
  const language = useDisclosure()

  const handleChange = (localization: Localization) => () => {
    router.replace(localization.slug, {
      locale: localization.locale,
    })
    language.onClose()
  }

  return (
    <header className='border-b-chinese-white border-b bg-white'>
      <Section>
        <nav className='flex h-15 items-center justify-between gap-4 md:gap-6'>
          <Link href='/'>
            <img
              className={cn('w-18.75 md:w-25', {
                'size-8': isMobile,
              })}
              src={isMobile ? '/logos/logo.svg' : '/logos/wordmark.svg'}
              alt='Inca Trail Operator'
              loading='lazy'
            />
          </Link>
          <div
            onClick={language.onOpen}
            className='hover:bg-anti-flash-white active:bg-chinese-white active:text-dav-ys-grey flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5'
          >
            <Icons.Language className='size-5' />
            <span className='text-base leading-5 font-medium'>{t(locale)}</span>
          </div>
        </nav>
      </Section>
      <Modal isOpen={language.isOpen} onClose={language.onClose}>
        <div className='flex flex-col gap-2'>
          {localizations.map((localization, index) => {
            const active = localization.locale === locale

            return (
              <div
                key={index}
                onClick={handleChange(localization)}
                className={cn(
                  'hover:bg-anti-flash-white flex cursor-pointer rounded-lg p-4',
                  {
                    'bg-anti-flash-white': active,
                  },
                )}
              >
                <span className='text-base leading-5 font-medium'>
                  {t(localization.locale)}
                </span>
              </div>
            )
          })}
        </div>
      </Modal>
    </header>
  )
}
