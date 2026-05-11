import { useEffect, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { Icons } from '@/icons/icon'
import { cn, verifyOpenedModals } from '@/lib/utils'

interface Props {
  variant?: 'preview'
  title?: string
  isOpen: boolean
  onClose: () => void
}

export function Modal({
  variant,
  title,
  isOpen,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'touch-none')
    }
    return verifyOpenedModals
  }, [isOpen])

  return (
    <>
      {isOpen &&
        createPortal(
          <div
            role='dialog'
            className='z-overlay fixed inset-0 top-0 left-0 flex items-center justify-center'
          >
            <div
              onClick={onClose}
              className='absolute inset-0 bg-black/40 opacity-80'
            />
            <div
              className={cn(
                'animate-fade-in z-overlay relative flex size-full max-w-full flex-col overflow-hidden bg-white md:m-4 md:h-auto md:w-125 md:rounded-xl',
                {
                  'md:max-h-modal-height max-w-200 md:h-auto md:w-full':
                    variant === 'preview',
                },
              )}
            >
              <div className='flex justify-end px-6 py-4'>
                <Icons.Close
                  onClick={onClose}
                  className='size-5 cursor-pointer'
                />
              </div>
              <div
                className={cn('scrollbar-hidden overflow-y-auto px-6 py-5', {
                  'size-full overflow-visible py-0': variant === 'preview',
                })}
              >
                {title && (
                  <h2 className='mb-4 text-2xl leading-7.25 font-bold md:text-[28px] md:leading-8.5'>
                    {title}
                  </h2>
                )}
                {children}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
