import { useState, ChangeEvent } from 'react'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

interface Props {
  ref?: RefCallBack
  label: string
  type?: 'text' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  translate?: boolean
  invalid?: boolean
}

export function Input({
  ref,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  translate,
  invalid,
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    onChange(text)
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
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
      <div className='relative w-full'>
        <input
          ref={ref}
          type={type === 'password' && showPassword ? 'text' : type}
          className={cn(
            'border-chinese-white placeholder:text-sonic-silver w-full rounded-sm border-2 bg-white p-4 text-base leading-4.75 outline-hidden focus:border-black',
            {
              'border-ue-red': invalid,
              'pr-10': type === 'password',
            },
          )}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <div className='absolute top-0 right-0 bottom-0 flex items-center p-2'>
            <button
              onClick={handleTogglePassword}
              className='hover:bg-anti-flash-white active:bg-chinese-white flex size-8 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
            >
              {showPassword ? (
                <Icons.EyeOpen className='size-4' />
              ) : (
                <Icons.EyeHidden className='size-4' />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
