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

export function Toast({ id, message, status }: Props) {
  const handleClose = () => {
    sonnerToast.dismiss(id)
  }

  return (
    <div
      key={id}
      className='shadow-main border-faded-white animate-fade-in flex min-w-60 items-center justify-between gap-2 rounded-2xl border bg-white p-4'
    >
      <span
        className={cn('font-gt-eesti flex-1 text-sm leading-4.5', {
          'text-cayenne-red': status === 'error',
          'text-dark-jade': status === 'success',
        })}
      >
        {message}
      </span>
      <button
        onClick={handleClose}
        className='hover:bg-faded-white/80 hover:text-camouflage-blue flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
      >
        <Icons.Close className='size-5' />
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
