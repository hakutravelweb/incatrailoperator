import { useEffect, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { Icons } from '@/icons/icon'
import { cn, verifyOpenedModals } from '@/lib/utils'
import { Button } from './button'

interface Action {
  type: 'close' | 'action'
  disabled?: boolean
  text: string
  onClick?: () => void
}

interface Props {
  variant?: 'preview' | 'manage'
  title?: string
  isOpen: boolean
  onClose: () => void
  actions?: Action[]
}

export function Modal({
  variant,
  title,
  isOpen,
  onClose,
  actions = [],
  children,
}: PropsWithChildren<Props>) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden', 'touch-none')
    }
    return () => verifyOpenedModals()
  }, [isOpen])

  return (
    <>
      {isOpen &&
        createPortal(
          <div
            role='dialog'
            className='z-overlay fixed inset-0 top-0 left-0 flex items-center justify-center'
          >
            <div onClick={onClose} className='absolute inset-0 bg-black/50' />
            <div
              className={cn(
                'animate-fade-in z-overlay shadow-main md:border-faded-white relative flex size-full max-w-full flex-col overflow-hidden bg-white md:m-4 md:h-auto md:w-115 md:rounded-2xl md:border',
                {
                  'md:m-0 md:h-full md:w-full md:rounded-none md:border-none':
                    variant === 'preview',
                  'md:max-h-modal-height': variant === 'manage',
                },
              )}
            >
              <div className='flex items-center p-3'>
                <button
                  onClick={onClose}
                  className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
                >
                  <Icons.Close className='size-6' />
                </button>
                {title && (
                  <div className='flex-1 px-3 text-center text-xl leading-6 font-bold'>
                    {title}
                  </div>
                )}
              </div>
              <div
                className={cn('scrollbar-hidden overflow-y-auto px-6 pb-6', {
                  'size-full overflow-visible': variant === 'preview',
                })}
              >
                {children}
              </div>
              {actions.length > 0 && (
                <div className='border-t-faded-white shadow-soft-drop flex justify-end gap-3 border-t px-6 py-3'>
                  {actions.map((action, index) => {
                    return (
                      <Button
                        key={index}
                        variant={
                          action.type === 'close' ? 'outline' : undefined
                        }
                        widthFit
                        disabled={action.disabled}
                        onClick={action.onClick}
                      >
                        {action.text}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
