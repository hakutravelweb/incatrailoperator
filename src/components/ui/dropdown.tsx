'use client'
import {
  useRef,
  createContext,
  useContext,
  PropsWithChildren,
  useState,
  useCallback,
  useLayoutEffect,
  RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Icons } from '@/icons/icon'
import { useOnClickOutside } from '@/hooks/use-onclick-outside'
import { Disclosure, useDisclosure } from '@/hooks/use-disclosure'

interface DropdownContext {
  variant?: 'manage'
  disclosure: Disclosure
  triggerRef: RefObject<HTMLDivElement | null>
}

const DropdownContext = createContext<DropdownContext | undefined>(undefined)

function useDropdownContext(componentName: string): DropdownContext {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error(
      `Dropdown (${componentName}) must be used within a Dropdown Context`,
    )
  }
  return context
}

interface Props {
  variant?: 'manage'
}

export function Dropdown({ variant, children }: PropsWithChildren<Props>) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const disclosure = useDisclosure()

  return (
    <DropdownContext.Provider value={{ variant, disclosure, triggerRef }}>
      <div className='relative size-fit'>{children}</div>
    </DropdownContext.Provider>
  )
}

const TRIGGER_NAME = 'DropdownTrigger'

function DropdownTrigger({ children }: PropsWithChildren) {
  const { disclosure, triggerRef } = useDropdownContext(TRIGGER_NAME)
  return (
    <div
      ref={triggerRef}
      onClick={disclosure.onToggle}
      className='cursor-pointer'
    >
      {children}
    </div>
  )
}
DropdownTrigger.displayName = TRIGGER_NAME

const CONTENT_NAME = 'DropdownContent'

const DropdownContent = ({ children }: PropsWithChildren) => {
  const { disclosure, triggerRef } = useDropdownContext(CONTENT_NAME)
  const contentRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
  })

  const getPosition = useCallback(() => {
    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const contentRect = contentRef.current?.getBoundingClientRect()

    if (!disclosure.isOpen || !triggerRect || !contentRect) {
      return {
        top: coords.top,
        left: coords.left,
      }
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const offset = 8

    let top = triggerRect.bottom + offset
    let left = triggerRect.right - contentRect.width

    if (
      top + contentRect.height > viewportHeight &&
      triggerRect.top - contentRect.height - offset > 0
    ) {
      top = triggerRect.top - contentRect.height - offset
    }

    if (left < 0) {
      left = triggerRect.left
    }

    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - offset
    }

    //  if (top < offset) top = offset
    // if (left < offset) left = offset

    if (coords.top !== top || coords.left !== left) {
      setCoords({ top, left })
    }

    return {
      top: coords.top,
      left: coords.left,
    }
  }, [disclosure.isOpen, triggerRef, coords])

  const updatePosition = useCallback(() => {
    getPosition()
  }, [getPosition])

  useLayoutEffect(() => {
    if (disclosure.isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [disclosure.isOpen, updatePosition])

  useOnClickOutside({
    ref: [triggerRef, contentRef],
    handler: disclosure.onClose,
  })

  if (disclosure.isOpen) {
    return createPortal(
      <div
        ref={contentRef}
        style={getPosition()}
        className='shadow-main z-overlay border-faded-white fixed min-w-60 rounded-2xl border bg-white'
      >
        <div className='max-h-75 overflow-y-auto px-4 before:block before:h-4 before:content-[""] after:block after:h-4 after:content-[""]'>
          {children}
        </div>
      </div>,
      document.body,
    )
  }

  return null
}
DropdownContent.displayName = CONTENT_NAME

const OPTION_NAME = 'DropdownOption'

export interface DropdownOptionProps {
  danger?: boolean
  active?: boolean
  disabled?: boolean
  value?: string
  onClick?: () => void
}

function DropdownOption({
  danger,
  active,
  disabled,
  onClick,
  children,
}: PropsWithChildren<DropdownOptionProps>) {
  const context = useDropdownContext(OPTION_NAME)
  const hover = useDisclosure()

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    context.disclosure.onClose()
  }

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      onMouseOver={hover.onOpen}
      onMouseLeave={hover.onClose}
      className={cn(
        'disabled:text-nevada flex min-h-12 w-full cursor-pointer items-center gap-2 py-2 disabled:cursor-not-allowed',
        {
          'not-disabled:text-cayenne-red not-disabled:hover:text-cayenne-red':
            danger,
        },
      )}
    >
      {active !== undefined && (
        <div
          className={cn(
            'border-pewter-metallic flex size-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
            {
              'border-blue-fire': active,
              'border-trout bg-faded-white/80':
                hover.isOpen && !active && !disabled,
            },
          )}
        >
          {active && <div className='bg-blue-fire size-3 rounded-full' />}
        </div>
      )}
      <span className='flex-1 text-left text-base leading-5.5'>{children}</span>
    </button>
  )
}
DropdownOption.displayName = OPTION_NAME

Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent
Dropdown.Option = DropdownOption
