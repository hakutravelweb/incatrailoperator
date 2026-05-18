'use client'
import {
  useState,
  useMemo,
  Children,
  ReactElement,
  PropsWithChildren,
  cloneElement,
  isValidElement,
} from 'react'
import { cn } from '@/lib/utils'
import { useDisclosure } from '@/hooks/use-disclosure'

interface Props {
  variant?: 'translation'
  tabError?: number
}

export function Tabs({
  variant,
  tabError,
  children,
}: PropsWithChildren<Props>) {
  const [tabIndex, setTabIndex] = useState<number>(0)

  const childrenArray = useMemo(() => Children.toArray(children), [children])

  const tab = useMemo(() => {
    const element = childrenArray[tabIndex] as ReactElement<
      PropsWithChildren<TabProps>
    >
    return element.props
  }, [tabIndex, childrenArray])

  const handleChangeTab = (index: number) => () => {
    setTabIndex(index)
  }

  return (
    <div
      className={cn('flex flex-col gap-4', {
        'gap-1': variant === 'translation',
      })}
    >
      <div
        className={cn(
          'scrollbar-hidden border-b-faded-white flex overflow-x-auto border-b',
          {
            'gap-2 border-none': variant === 'translation',
          },
        )}
      >
        {childrenArray.map((child, index) => {
          const element = child as ReactElement<TabProps>
          if (isValidElement(element)) {
            return cloneElement<TabProps>(element, {
              variant,
              error: tabError === index,
              active: index === tabIndex,
              onClick: handleChangeTab(index),
            })
          }
          return element
        })}
      </div>
      <div aria-label={tab.label} key={tabIndex}>
        {tab.children}
      </div>
    </div>
  )
}

interface TabProps {
  variant?: 'translation'
  error?: boolean
  active?: boolean
  onClick?: () => void
  label: string
}

export function Tab({
  variant,
  error,
  active,
  onClick,
  label,
}: PropsWithChildren<TabProps>) {
  if (variant === 'translation') {
    const hover = useDisclosure()

    return (
      <button
        onClick={onClick}
        onMouseOver={hover.onOpen}
        onMouseLeave={hover.onClose}
        className={cn('flex cursor-pointer items-center gap-1', {
          'text-cayenne-red': error,
        })}
      >
        <div
          className={cn(
            'border-pewter-metallic flex size-4 items-center justify-center rounded-full border-2 transition-colors duration-200',
            {
              'border-blue-fire': active,
              'border-cayenne-red': error,
              'border-trout bg-faded-white/80':
                hover.isOpen && !active && !error,
            },
          )}
        >
          {active && (
            <div
              className={cn('bg-blue-fire size-2 rounded-full', {
                'bg-cayenne-red': error,
              })}
            />
          )}
        </div>
        <span className='text-sm leading-4.5'>{label}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'transition-color text-nevada hover:bg-bright-grey cursor-pointer rounded-t-sm whitespace-nowrap duration-200',
        {
          'shadow-tab-inset text-abstract-navy font-medium': active,
          'shadow-tab-inset-error text-cayenne-red': error,
        },
      )}
    >
      <div className='px-4 py-2'>
        <span className='text-base leading-5.5'>{label}</span>
      </div>
    </button>
  )
}
