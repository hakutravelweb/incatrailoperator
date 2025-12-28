import { ChangeEvent } from 'react'
import { RefCallBack } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface Props {
  ref?: RefCallBack
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid: boolean
  translate?: boolean
}

export function Textarea({
  ref,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  translate,
}: Props) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text: string = event.target.value
    onChange(text)
  }

  return (
    <div className='flex flex-col items-start gap-px'>
      {translate ? (
        <span className='bg-anti-flash-white mb-1 rounded-sm px-2 py-1 text-sm leading-4.5'>
          {label}
        </span>
      ) : (
        <label className='text-base leading-4.75 font-bold'>{label}</label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'border-chinese-white placeholder:text-sonic-silver field-sizing-content min-h-25 w-full resize-none rounded-sm border-2 bg-white p-4 text-base leading-4.75 outline-hidden focus:border-black',
          {
            'border-ue-red': invalid,
          },
        )}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  )
}
