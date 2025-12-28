'use client'
import {
  useMemo,
  PropsWithChildren,
  Children,
  ReactElement,
  cloneElement,
} from 'react'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Dropdown, DropdownOptionProps } from './dropdown'

interface Props {
  ref?: RefCallBack
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  invalid: boolean
}

export function Select({
  ref,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  children,
}: PropsWithChildren<Props>) {
  const option = useMemo(() => {
    const option = Children.toArray(children).find((child) => {
      const option = child as ReactElement<
        PropsWithChildren<DropdownOptionProps>
      >
      return option.props.value === value
    }) as ReactElement<PropsWithChildren<DropdownOptionProps>>
    if (option) {
      return option.props.children
    }
  }, [value, children])

  const handleChange = (option: string) => {
    onChange(option)
  }

  return (
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-4.75 font-bold'>{label}</label>
      <Dropdown>
        <Dropdown.Trigger>
          <div
            className={cn(
              'border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex items-center gap-1 rounded-full border-2 bg-white px-4 py-2',
              {
                'border-ue-red': invalid,
              },
            )}
          >
            <span className='text-base leading-4.75'>
              {option ?? placeholder}
            </span>
            <Icons.Down className='size-5' />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Children.map(children, (child) => {
            const element = child as ReactElement<DropdownOptionProps>
            const active: boolean = element.props.value === value

            return cloneElement<DropdownOptionProps>(element, {
              active,
              onClick: () => handleChange(element.props.value ?? ''),
            })
          })}
        </Dropdown.Content>
      </Dropdown>
    </div>
  )
}

Select.Option = Dropdown.Option
