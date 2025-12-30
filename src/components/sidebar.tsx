import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, verifyOpenedModals } from '@/lib/utils'
import { useRouter } from '@/i18n/routing'
import { Localization } from '@/interfaces/root'
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
    return verifyOpenedModals
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
              className='absolute inset-0 bg-black/40 opacity-80'
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
                  className='hover:bg-anti-flash-white active:bg-chinese-white active:text-dav-ys-grey flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5'
                >
                  <Icons.Language className='size-5' />
                  <span className='text-base leading-5 font-medium'>
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
                  {t(`language.${localization.locale}`)}
                </span>
              </div>
            )
          })}
        </div>
      </Modal>
    </>
  )
}
