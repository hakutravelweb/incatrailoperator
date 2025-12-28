import { ReactNode } from 'react'
import { toast as sonnerToast } from 'sonner'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

type Status = 'success' | 'error' | 'warning'

interface Props {
  id: string | number
  message: ReactNode
  status: Status
}

function Toast({ id, message, status }: Props) {
  const handleClose = () => {
    sonnerToast.dismiss(id)
  }

  return (
    <div
      className={cn(
        'shadow-soft-drop bg-inferno flex min-w-91 items-center justify-between gap-2 rounded-lg p-4',
        {
          'bg-ue-red': status === 'error',
          'bg-yellow-sea': status === 'warning',
        },
      )}
    >
      <span className='font-aeonik flex-1 text-sm leading-4.25 font-medium text-white'>
        {message}
      </span>
      <button
        onClick={handleClose}
        className={cn(
          'hover:bg-outrageous-orange active:bg-cinnabar bg-inferno flex size-8 cursor-pointer items-center justify-center rounded-2xl p-1 transition-colors',
          {
            'bg-ue-red hover:bg-white/20 active:bg-black/10':
              status === 'error',
            'bg-yellow-sea hover:bg-white/20 active:bg-black/10':
              status === 'warning',
          },
        )}
      >
        <Icons.Close className='size-5 text-white' />
      </button>
    </div>
  )
}

export const toast: Record<Status, (message: ReactNode) => ReactNode> = {
  success: (message: ReactNode) =>
    sonnerToast.custom((id) => (
      <Toast id={id} message={message} status='success' />
    )),
  error: (message: ReactNode) =>
    sonnerToast.custom((id) => (
      <Toast id={id} message={message} status='error' />
    )),
  warning: (message: ReactNode) =>
    sonnerToast.custom((id) => (
      <Toast id={id} message={message} status='warning' />
    )),
}
