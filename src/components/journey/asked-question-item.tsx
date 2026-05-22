'use client'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { AskedQuestion } from '@/interfaces/journey'
import { useDisclosure } from '@/hooks/use-disclosure'

interface Props {
  askedQuestion: AskedQuestion
}

export function AskedQuestionItem({ askedQuestion }: Props) {
  const toggle = useDisclosure()

  return (
    <div className='flex flex-col'>
      <div
        onClick={toggle.onToggle}
        className='flex cursor-pointer items-center justify-between gap-4 py-4'
      >
        <span className='flex-1 text-lg leading-6.5 font-medium'>
          {askedQuestion.title}
        </span>
        <Icons.Down
          className={cn('size-5 transition-transform duration-200', {
            'rotate-180': toggle.isOpen,
          })}
        />
      </div>
      {toggle.isOpen && (
        <div className='text-base leading-5.5'>{askedQuestion.description}</div>
      )}
    </div>
  )
}
