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
            <div className='flex items-center gap-4'>
              <div className='hidden md:flex md:gap-4'>
                <HeaderLink icon='Heart' href='/articles'>
                  {t('articles')}
                </HeaderLink>
                <HeaderLink icon='Profile' href='/about-us'>
                  {t('about-us')}
                </HeaderLink>
                <HeaderLink icon='Email' href='/contact-us'>
                  {t('contact-us')}
                </HeaderLink>
              </div>
              <div
                onClick={language.onOpen}
                className='flex cursor-pointer flex-col items-center gap-0.5'
              >
                <Icons.Language className='text-nevada size-6' />
                <span className='text-nevada text-sm leading-4.25 uppercase'>
                  {locale}
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
            <LanguageOption
              key={localization.locale}
              active={active}
              onClick={handleChange(localization)}
            >
              {t(`language.${localization.locale}`)}
            </LanguageOption>
          )
        })}
      </Modal>
      <Sidebar disclosure={sidebar} localizations={localizations} />
    </header>
  )
}

interface HeaderLinkProps {
  variant?: 'sidebar'
  icon?: keyof typeof Icons
  href: string
}

export function HeaderLink({
  variant,
  icon,
  href,
  children,
}: PropsWithChildren<HeaderLinkProps>) {
  const Icon = icon ? Icons[icon] : null

  if (variant === 'sidebar') {
    return (
      <Link
        href={href}
        className='border-b-bright-grey flex h-14 items-center gap-2 border-b p-4'
      >
        {Icon && <Icon className='size-6' />}
        <span className='text-nevada line-clamp-1 flex-1 text-left text-base leading-5.5'>
          {children}
        </span>
        <Icons.Right className='size-6' />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className='hover:underline-premium flex flex-col items-center gap-0.5'
    >
      {Icon && <Icon className='text-nevada size-6' />}
      <span className='text-nevada hover:text-abstract-navy text-sm leading-4.25 transition-colors duration-200'>
        {children}
      </span>
    </Link>
  )
}

interface LanguageOptionProps {
  active?: boolean
  onClick?: () => void
}

export function LanguageOption({
  active,
  onClick,
  children,
}: PropsWithChildren<LanguageOptionProps>) {
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
