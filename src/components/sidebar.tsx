import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, verifyOpenedModals } from '@/lib/utils'
import { useRouter } from '@/i18n/routing'
import { Localization } from '@/shared/interfaces'
import { Disclosure, useDisclosure } from '@/hooks/use-disclosure'
import { HeaderLink, LanguageOption } from './header'
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
    <div className='flex flex-col'>
      {disclosure.isOpen &&
        createPortal(
          <div
            role='dialog'
            className={cn(
              'z-overlay fixed inset-0 flex -translate-x-full flex-col bg-white transition-transform',
              {
                'translate-x-0': disclosure.isSlide,
              },
            )}
          >
            <div className='bg-abstract-navy flex items-center justify-end gap-2 px-4 py-3'>
              <button
                onClick={disclosure.onClose}
                className='flex size-11 cursor-pointer items-center justify-center p-2.5 text-white'
              >
                <Icons.Close className='size-6' />
              </button>
            </div>
            <div className='flex flex-col'>
              <button
                onClick={language.onOpen}
                className='border-b-bright-grey flex h-14 cursor-pointer items-center gap-2 border-b p-4'
              >
                <Icons.Language className='size-6' />
                <div className='flex flex-1 items-center justify-between gap-4'>
                  <span className='line-clamp-1 text-base leading-5.5'>
                    {t('language.label')}
                  </span>
                  <span className='text-nevada line-clamp-1 text-base leading-5.5'>
                    {t(`language.${locale}`)}
                  </span>
                </div>
                <Icons.Right className='size-6' />
              </button>
              <HeaderLink variant='sidebar' icon='Heart' href='/articles'>
                {t('articles')}
              </HeaderLink>
              <HeaderLink variant='sidebar' icon='Profile' href='/about-us'>
                {t('about-us')}
              </HeaderLink>
              <HeaderLink variant='sidebar' icon='Email' href='/contact-us'>
                {t('contact-us')}
              </HeaderLink>
            </div>
          </div>,
          document.body,
        )}
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
    </div>
  )
}
