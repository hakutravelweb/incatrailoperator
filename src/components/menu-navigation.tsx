'use client'
import { useState } from 'react'
import { cn, navigateScrollInto } from '@/lib/utils'
import { Navigation } from '@/interfaces/root'
import { useObserver } from '@/hooks/use-observer'

interface Props {
  navigation: Navigation[]
}

export function MenuNavigation({ navigation }: Props) {
  const [selectorId, setSelectorId] = useState<string>('')

  useObserver('data-toc-id', (id) => {
    setSelectorId(id)
  })

  const handleNavigation = (id: string) => () => {
    navigateScrollInto('data-toc-id', id)
  }

  return (
    <div className='flex flex-col gap-2'>
      {navigation.map((item) => {
        const active = selectorId === item.id

        return (
          <div
            key={item.id}
            onClick={handleNavigation(item.id)}
            className={cn(
              'hover:bg-outrageous-orange/10 text-dark-charcoal hover:text-inferno cursor-pointer rounded-md p-2 transition-colors duration-100',
              {
                'bg-outrageous-orange/10 text-inferno': active,
              },
            )}
          >
            <span className='text-base leading-5 font-medium'>
              {item.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
