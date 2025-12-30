'use client'
import { Icons } from '@/icons/icon'
import { AskedQuestion } from '@/interfaces/attraction-product'
import { useDisclosure } from '@/hooks/use-disclosure'

interface Props {
  askedQuestion: AskedQuestion
}

export function AskedQuestionItem({ askedQuestion }: Props) {
  const toggle = useDisclosure()

  return (
    <div className='border-chinese-white divide-chinese-white divide-y-2 rounded-xl border-2'>
      <div
        onClick={toggle.onToggle}
        className='flex cursor-pointer items-center justify-between gap-4 p-4'
      >
        <strong className='text-lg leading-6'>{askedQuestion.title}</strong>
        {toggle.isOpen ? (
          <Icons.Up className='size-5' />
        ) : (
          <Icons.Down className='size-5' />
        )}
      </div>
      {toggle.isOpen && (
        <div className='text-dark-charcoal p-4 text-base leading-6'>
          {askedQuestion.description}
        </div>
      )}
    </div>
  )
}
