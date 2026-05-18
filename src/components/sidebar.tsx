import { PropsWithChildren, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, verifyOpenedModals } from '@/lib/utils'
import { useRouter } from '@/i18n/routing'
import { Localization } from '@/shared/interfaces'
import { Disclosure, useDisclosure } from '@/hooks/use-disclosure'
import { HeaderLink } from './header'
import { Modal } from './ui/modal'

interface Props {
  disclosure: Disclosure
  localizations: Localization[]
}

export function Sidebar({ disclosure, localizations }: Props) {
  const locale = useLocale()
  const t = useTranslations('Header')
  const router = useRouter()
  const language = useDisclosure()

  useEffect(() => {
    if (disclosure.isOpen) {
      document.body.classList.add('overflow-hidden', 'touch-none')
    }
    return () => verifyOpenedModals()
  }, [disclosure.isOpen])

  const handleChange = (localization: Localization) => () => {
    router.replace(localization.slug, {
      locale: localization.locale,
    })
    language.onClose()
  }

  return (
    <>
      {disclosure.isOpen &&
        createPortal(
          <div role='dialog' className='z-overlay fixed inset-0'>
            <div
              onClick={disclosure.onClose}
              className='absolute inset-0 bg-black/50 opacity-80'
            />
            <div
              className={cn(
                'shadow-sidebar max-w-sidebar z-overlay flex h-full max-h-full w-96 -translate-x-full flex-col bg-white transition-transform',
                {
                  'translate-x-0': disclosure.isSlide,
                },
              )}
            >
              <div className='flex items-center justify-between gap-2 p-6'>
                <img className='size-8' src='/logos/logo.svg' loading='lazy' />
                <Icons.Close
                  onClick={disclosure.onClose}
                  className='size-6 cursor-pointer'
                />
              </div>
              <div className='flex flex-col gap-6 p-6'>
                <div
                  onClick={language.onOpen}
                  className='hover:bg-faded-white bg-bright-grey flex w-fit cursor-pointer items-center gap-1 rounded-full px-3 py-2'
                >
                  <Icons.Language className='size-5' />
                  <span className='text-sm leading-5'>
                    {t(`language.${locale}`)}
                  </span>
                </div>
                <HeaderLink href='/articles'>{t('articles')}</HeaderLink>
                <HeaderLink href='/about-us'>{t('about-us')}</HeaderLink>
                <HeaderLink href='/contact-us'>{t('contact-us')}</HeaderLink>
              </div>
            </div>
          </div>,
          document.body,
        )}
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
    </>
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
