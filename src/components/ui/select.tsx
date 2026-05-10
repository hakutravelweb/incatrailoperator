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
  emptyMessage?: string
}

export function Select({
  ref,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  emptyMessage,
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
    if (value === option) {
      onChange('')
    } else {
      onChange(option)
    }
  }

  return (
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-4.75 font-medium'>{label}</label>
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
          {Children.count(children) === 0 && (
            <div className='text-dav-ys-grey text-center text-sm leading-4.5'>
              {emptyMessage}
            </div>
          )}
          {Children.map(children, (child) => {
            const element = child as ReactElement<DropdownOptionProps>
            const active = element.props.value === value

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

interface PropsSelectMultiple {
  ref?: RefCallBack
  disabled?: boolean
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  invalid: boolean
  emptyMessage?: string
}

export function SelectMultiple({
  ref,
  disabled,
  label,
  value,
  onChange,
  placeholder,
  invalid,
  emptyMessage,
  children,
}: PropsWithChildren<PropsSelectMultiple>) {
  const selectedOptions = useMemo(() => {
    const options = Children.toArray(children).filter((child) => {
      const option = child as ReactElement<
        PropsWithChildren<DropdownOptionProps>
      >
      return value.includes(option.props.value ?? '')
    }) as ReactElement<PropsWithChildren<DropdownOptionProps>>[]

    return options.map((option) => option.props.children)
  }, [value, children])

  const handleChange = (option: string) => {
    if (disabled) return
    if (value.includes(option)) {
      const updatedValue = value.filter((item) => item !== option)
      onChange(updatedValue)
    } else {
      value.push(option)
      onChange(value)
    }
  }

  return (
    <div className='relative flex flex-col gap-1'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-6 font-medium'>{label}</label>
      <Dropdown>
        <Dropdown.Trigger>
          <div
            className={cn(
              'border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex items-center gap-1 rounded-full border-2 bg-white px-4 py-2 transition-colors duration-100',
              {
                'border-ue-red': invalid,
                'text-nevada/50 cursor-default': disabled,
              },
            )}
          >
            <span className='text-base leading-6'>
              {selectedOptions.length > 0
                ? selectedOptions.join(', ')
                : placeholder}
            </span>
            <Icons.Down className='size-5' />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Children.count(children) === 0 && (
            <div className='text-center text-sm leading-4.5'>
              {emptyMessage}
            </div>
          )}
          {Children.map(children, (child) => {
            const element = child as ReactElement<DropdownOptionProps>
            const active = value.includes(element.props.value ?? '')

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

SelectMultiple.Option = Dropdown.Option
