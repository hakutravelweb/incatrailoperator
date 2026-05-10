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
  const { variant, disclosure, triggerRef } = useDropdownContext(CONTENT_NAME)
  const contentRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    isBottom: true,
    arrowX: 0,
  })

  const getPosition = useCallback(() => {
    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const contentRect = contentRef.current?.getBoundingClientRect()

    if (!disclosure.isOpen || !triggerRect || !contentRect) {
      return {
        top: coords.top,
        left: coords.left,
        '--arrow-x': `${coords.arrowX}px`,
      }
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const offset = 12
    const safeMargin = 20

    let top = triggerRect.bottom + offset
    let left = triggerRect.right - contentRect.width
    let isBottom = true

    if (
      top + contentRect.height > viewportHeight &&
      triggerRect.top - contentRect.height - offset > 0
    ) {
      top = triggerRect.top - contentRect.height - offset
      isBottom = false
    }

    if (left < 0) {
      left = triggerRect.left
    }

    if (left + contentRect.width > viewportWidth) {
      left = viewportWidth - contentRect.width - offset
    }

    //  if (top < offset) top = offset
    // if (left < offset) left = offset

    const triggerCenter = triggerRect.left + triggerRect.width / 2
    let arrowX = triggerCenter - left

    if (arrowX < safeMargin) {
      const diff = safeMargin - arrowX
      left -= diff
      arrowX = safeMargin
    } else if (arrowX > contentRect.width - safeMargin) {
      const diff = arrowX - (contentRect.width - safeMargin)
      left += diff
      arrowX = contentRect.width - safeMargin
    }

    if (
      coords.top !== top ||
      coords.left !== left ||
      coords.isBottom !== isBottom ||
      coords.arrowX !== arrowX
    ) {
      setCoords({ top, left, isBottom, arrowX })
    }

    return {
      top: coords.top,
      left: coords.left,
      '--arrow-x': `${coords.arrowX}px`,
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
        className={cn(
          'drop-shadow-deep z-overlay fixed min-w-48 rounded-xl bg-white after:absolute after:left-(--arrow-x) after:-translate-x-1/2 after:border-x-10 after:border-x-transparent after:content-[""]',
          coords.isBottom
            ? 'after:-top-2 after:border-b-8 after:border-b-white'
            : 'after:-bottom-2 after:border-t-8 after:border-t-white',
          {
            'drop-shadow-tiny': variant === 'manage',
          },
        )}
      >
        <div
          className={cn(
            'max-h-75 overflow-y-auto px-4 before:block before:h-4 before:content-[""] after:block after:h-4 after:content-[""]',
            {
              'px-6 before:h-6 after:h-6': variant === 'manage',
            },
          )}
        >
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
  icon?: keyof typeof Icons
  active?: boolean
  disabled?: boolean
  value?: string
  onClick?: () => void
}

function DropdownOption({
  danger,
  icon,
  active,
  disabled,
  onClick,
  children,
}: PropsWithChildren<DropdownOptionProps>) {
  const context = useDropdownContext(OPTION_NAME)
  const Icon = icon ? Icons[icon] : null

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    context.disclosure.onClose()
  }

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'not-disabled:hover:bg-bright-grey disabled:text-nevada not-disabled:text-trout not-disabled:hover:text-cello flex min-h-11 w-full cursor-pointer items-center gap-2 bg-white p-2 text-left transition-colors duration-100',
        {
          'not-disabled:text-ue-red not-disabled:hover:text-ue-red': danger,
          'not-disabled:bg-bright-grey not-disabled:text-abstract-navy': active,
        },
      )}
    >
      {Icon && <Icon className='size-5' />}
      <span className='text-base leading-5.25'>{children}</span>
    </button>
  )
}
DropdownOption.displayName = OPTION_NAME

Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent
Dropdown.Option = DropdownOption