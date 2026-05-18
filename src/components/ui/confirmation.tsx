import { createRoot } from 'react-dom/client'
import { Button } from './button'

interface Data {
  message: string
  confirmText: string
  declineText: string
}

interface Props extends Data {
  resolve: (value: boolean) => void
}

function Confirmation({ message, confirmText, declineText, resolve }: Props) {
  const handleResolve = (value: boolean) => () => {
    resolve(value)
  }

  return (
    <div className='z-overlay fixed inset-0 flex items-center justify-center'>
      <div
        onClick={handleResolve(false)}
        className='bg-abstract-navy/40 absolute inset-0 opacity-80'
      />
      <div className='animate-fade-in z-overlay border-faded-white shadow-main relative m-4 flex w-125 max-w-full flex-col gap-6 rounded-2xl border bg-white px-6 py-5'>
        <p className='text-base leading-5.5'>{message}</p>
        <div className='flex gap-4'>
          <Button widthFit onClick={handleResolve(true)}>
            {confirmText}
          </Button>
          <Button widthFit variant='outline' onClick={handleResolve(false)}>
            {declineText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export async function confirmation(data: Data) {
  return new Promise<boolean>((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const handleResolve = (value: boolean) => {
      resolve(value)
      root.unmount()
      container.remove()
    }

    const root = createRoot(container)
    root.render(<Confirmation {...data} resolve={handleResolve} />)
  })
}
