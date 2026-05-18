'use client'
import { useState } from 'react'
import { cn, navigateScrollInto } from '@/lib/utils'
import { Navigation } from '@/shared/interfaces'
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
    <div className='flex flex-col'>
      {navigation.map((item) => {
        const active = selectorId === item.id

        return (
          <div
            key={item.id}
            onClick={handleNavigation(item.id)}
            className='flex min-h-12 cursor-pointer items-center gap-2 py-2'
          >
            <div
              className={cn(
                'border-pewter-metallic flex size-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
                {
                  'border-blue-fire': active,
                },
              )}
            >
              {active && <div className='bg-blue-fire size-3 rounded-full' />}
            </div>
            <span className='flex-1 text-left text-base leading-5.5'>
              {item.title}
            </span>
          </div>
        )
      })}
    </div>
  )
}
