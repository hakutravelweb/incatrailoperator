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

interface Props {
  tabError?: number
}

export function Tabs({ tabError, children }: PropsWithChildren<Props>) {
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
    <div className='flex flex-col gap-4'>
      <div className='scrollbar-hidden flex items-end gap-4 overflow-x-auto py-1'>
        {childrenArray.map((child, index) => {
          const element = child as ReactElement<TabProps>
          if (isValidElement(element)) {
            return cloneElement<TabProps>(element, {
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
  error?: boolean
  active?: boolean
  onClick?: () => void
  label: string
}

export function Tab({
  error,
  active,
  onClick,
  label,
}: PropsWithChildren<TabProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:text-dav-ys-grey transition-color flex cursor-pointer flex-col items-center p-1 pb-0 whitespace-nowrap duration-100 after:invisible after:block after:w-full after:border-b-2 after:border-b-black after:pt-2 after:content-[""] hover:after:visible',
        {
          'after:visible': active,
          'after:border-b-ue-red text-ue-red': error,
        },
      )}
    >
      <span className='text-base leading-4.75 font-medium'>{label}</span>
    </button>
  )
}
