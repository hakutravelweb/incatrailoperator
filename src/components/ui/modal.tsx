import { useEffect, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { Icons } from '@/icons/icon'
import { verifyOpenedModals } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function Modal({ isOpen, onClose, children }: PropsWithChildren<Props>) {
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
            <div className='animate-fade-in z-overlay relative m-4 flex w-125 max-w-full flex-col rounded-2xl bg-white'>
              <div className='flex justify-end px-6 py-4'>
                <Icons.Close
                  onClick={onClose}
                  className='size-5 cursor-pointer'
                />
              </div>
              <div className='scrollbar-hidden overflow-y-auto px-6 py-5'>
                {children}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
