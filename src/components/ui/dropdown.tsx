'use client'
import {
  useEffect,
  useRef,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react'
import { cn, verifyOpenedModals } from '@/lib/utils'
import { Icons } from '@/icons/icon'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'
import { Disclosure, useDisclosure } from '@/hooks/use-disclosure'
import { useMediaQuery } from '@/hooks/use-media-query'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface DropdownContextValue {
  position: Position
  disclosure: Disclosure
}

const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined,
)

function useDropdownContext(componentName: string): DropdownContextValue {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error(
      `Dropdown (${componentName}) must be used within a Dropdown Context`,
    )
  }
  return context
}

interface Props {
  position?: Position
}

export function Dropdown({
  position = 'top-right',
  children,
}: PropsWithChildren<Props>) {
  const contentRef = useRef<HTMLDivElement>(null)
  const disclosure = useDisclosure()

  useOnClickOutside({
    ref: contentRef,
    handler: disclosure.onClose,
  })

  return (
    <DropdownContext.Provider value={{ position, disclosure }}>
      <div ref={contentRef} className='relative size-fit'>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

const TRIGGER_NAME = 'DropdownTrigger'

function DropdownTrigger({ children }: PropsWithChildren) {
  const context = useDropdownContext(TRIGGER_NAME)

  return (
    <div onClick={context.disclosure.onToggle} className='cursor-pointer'>
      {children}
    </div>
  )
}

DropdownTrigger.displayName = TRIGGER_NAME

const CONTENT_NAME = 'DropdownContent'

const DropdownContent = ({ children }: PropsWithChildren) => {
  const isMobile = useMediaQuery('max-w', 768)
  const context = useDropdownContext(CONTENT_NAME)

  useEffect(() => {
    if (context.disclosure.isOpen && isMobile) {
      document.body.classList.add('overflow-hidden', 'touch-none')
    }
    return verifyOpenedModals
  }, [context.disclosure.isOpen, isMobile])

  if (!context.disclosure.isOpen) return null

  return (
    <div
      className={cn(
        'shadow-deep z-overlay absolute flex max-h-75 min-w-48 flex-col rounded-xl bg-white after:absolute after:border-x-10 after:border-x-transparent after:border-y-white after:content-[""]',
        {
          'top-full left-0 mt-3 after:-top-2 after:left-6 after:border-b-8':
            context.position === 'top-left',
          'top-full right-0 mt-3 after:-top-2 after:right-6 after:border-b-8':
            context.position === 'top-right',
          'bottom-full left-0 mb-3 after:-bottom-2 after:left-6 after:border-t-8':
            context.position === 'bottom-left',
          'right-0 bottom-full mb-3 after:right-6 after:-bottom-2 after:border-t-8':
            context.position === 'bottom-right',
          'fixed inset-0 m-0 size-full max-h-full rounded-none': isMobile,
        },
      )}
    >
      {isMobile && (
        <div className='flex justify-end p-4'>
          <button
            onClick={context.disclosure.onClose}
            className='hover:bg-anti-flash-white active:bg-chinese-white flex size-8 cursor-pointer items-center justify-center rounded-full'
          >
            <Icons.Close className='size-5' />
          </button>
        </div>
      )}
      <div className='h-full overflow-y-auto px-4 before:block before:h-4 before:content-[""] after:block after:h-4 after:content-[""]'>
        {children}
      </div>
    </div>
  )
}

DropdownContent.displayName = CONTENT_NAME

const OPTION_NAME = 'DropdownOption'

export interface DropdownOptionProps {
  icon?: keyof typeof Icons
  active?: boolean
  value?: string
  onClick?: () => void
}

function DropdownOption({
  icon,
  active,
  onClick,
  children,
}: PropsWithChildren<DropdownOptionProps>) {
  const context = useDropdownContext(OPTION_NAME)
  const Icon = icon ? Icons[icon] : null

  const handleClick = () => {
    onClick?.()
    context.disclosure.onClose()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'hover:bg-anti-flash-white active:bg-chinese-white flex min-h-11 w-full cursor-pointer items-center gap-2 p-2 text-left',
        {
          'bg-anti-flash-white': active,
        },
      )}
    >
      {Icon && <Icon className='size-5' />}
      <span className='text-base leading-5.25 font-bold'>{children}</span>
    </button>
  )
}

DropdownOption.displayName = OPTION_NAME

Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent
Dropdown.Option = DropdownOption
