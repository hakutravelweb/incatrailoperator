'use client'
import { PropsWithChildren } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Link, useRouter } from '@/i18n/routing'
import { Localization } from '@/shared/interfaces'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Section } from './section'
import { Modal } from './ui/modal'
import { Sidebar } from './sidebar'

interface Props {
  localizations: Localization[]
}

export function Header({ localizations }: Props) {
  const locale = useLocale()
  const t = useTranslations('Header')
  const router = useRouter()
  const language = useDisclosure()
  const sidebar = useDisclosure({ animateSlide: true })

  const handleChange = (localization: Localization) => () => {
    router.replace(localization.slug, {
      locale: localization.locale,
    })
    language.onClose()
  }

  return (
    <header className='border-b-bright-grey border-b bg-white'>
      <Section>
        <nav className='flex h-20 items-center justify-between gap-4 md:gap-6'>
          <Link href='/'>
            <img
              className='h-12'
              src='/logos/wordmark.svg'
              alt='Inca Trail Operator'
              loading='lazy'
            />
          </Link>
          <div className='block lg:hidden'>
            <Icons.Menu
              onClick={sidebar.onOpen}
              className='size-8 cursor-pointer'
            />
          </div>
          <div className='hidden lg:block'>
            <div className='flex items-center gap-2'>
              <div className='hidden md:flex md:gap-4'>
                <HeaderLink href='/articles'>{t('articles')}</HeaderLink>
                <HeaderLink href='/about-us'>{t('about-us')}</HeaderLink>
                <HeaderLink href='/contact-us'>{t('contact-us')}</HeaderLink>
              </div>
              <div
                onClick={language.onOpen}
                className='hover:bg-faded-white bg-bright-grey flex cursor-pointer items-center gap-1 rounded-full px-3 py-2'
              >
                <Icons.Language className='size-5' />
                <span className='text-sm leading-5'>
                  {t(`language.${locale}`)}
                </span>
              </div>
            </div>
          </div>
        </nav>
      </Section>
      <Modal isOpen={language.isOpen} onClose={language.onClose}>
        {localizations.map((localization) => {
          const active = localization.locale === locale

          return (
            <HeaderOption
              key={localization.locale}
              active={active}
              onClick={handleChange(localization)}
            >
              {t(`language.${localization.locale}`)}
            </HeaderOption>
          )
        })}
      </Modal>
      <Sidebar disclosure={sidebar} localizations={localizations} />
    </header>
  )
}

interface HeaderLinkProps {
  href: string
}

export function HeaderLink({
  href,
  children,
}: PropsWithChildren<HeaderLinkProps>) {
  return (
    <Link href={href} className='hover:underline-premium'>
      <span className='text-nevada hover:text-abstract-navy text-sm leading-5 transition-colors duration-200'>
        {children}
      </span>
    </Link>
  )
}

interface HeaderOptionProps {
  active?: boolean
  onClick?: () => void
}

function HeaderOption({
  active,
  onClick,
  children,
}: PropsWithChildren<HeaderOptionProps>) {
  const hover = useDisclosure()

  return (
    <div
      onClick={onClick}
      onMouseOver={hover.onOpen}
      onMouseLeave={hover.onClose}
      className='flex min-h-12 cursor-pointer items-center gap-2 py-2'
    >
      <div
        className={cn(
          'border-pewter-metallic flex size-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
          {
            'border-blue-fire': active,
            'border-trout bg-faded-white/80': hover.isOpen && !active,
          },
        )}
      >
        {active && <div className='bg-blue-fire size-3 rounded-full' />}
      </div>
      <span className='flex-1 text-left text-base leading-5.5'>{children}</span>
    </div>
  )
}
