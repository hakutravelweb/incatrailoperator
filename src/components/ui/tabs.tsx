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

export function Tabs({ children }: PropsWithChildren) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const currentTab = useMemo(() => {
    const element = Children.toArray(children)[activeTab] as ReactElement<
      PropsWithChildren<TabProps>
    >
    return element.props
  }, [activeTab, children])

  const handleChangeTab = (index: number) => {
    setActiveTab(index)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='scrollbar-hidden flex items-end gap-4 overflow-x-auto py-1'>
        {Children.map(children, (child, index) => {
          const element = child as ReactElement<TabProps>
          if (isValidElement(element)) {
            return cloneElement<TabProps>(element, {
              active: index === activeTab,
              onClick: () => handleChangeTab(index),
            })
          }
          return element
        })}
      </div>
      <div aria-label={currentTab.label} key={activeTab}>
        {currentTab.children}
      </div>
    </div>
  )
}

interface TabProps {
  active?: boolean
  onClick?: () => void
  label: string
}

export function Tab({ active, onClick, label }: PropsWithChildren<TabProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:text-dav-ys-grey transition-color flex cursor-pointer flex-col items-center p-1 pb-0 whitespace-nowrap duration-100 after:invisible after:block after:w-full after:border-b-2 after:border-b-black after:pt-2 after:content-[""] hover:after:visible',
        {
          'after:visible': active,
        },
      )}
    >
      <span className='text-base leading-4.75 font-bold'>{label}</span>
    </button>
  )
}
