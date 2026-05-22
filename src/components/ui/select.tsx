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
      <label className='text-nevada text-xs leading-4'>{label}</label>
      <Dropdown>
        <Dropdown.Trigger>
          <div
            className={cn(
              'hover:bg-faded-white bg-bright-grey flex h-11 max-w-full min-w-44 items-center gap-2 rounded-full p-3',
              {
                'bg-cayenne-red/50': invalid,
              },
            )}
          >
            <span className='flex-1 text-base leading-5.5 font-medium'>
              {option ?? placeholder}
            </span>
            <Icons.Down className='size-5' />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Children.count(children) === 0 && (
            <div className='text-nevada text-center text-sm leading-4.5'>
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
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  invalid: boolean
  emptyMessage?: string
}

export function SelectMultiple({
  ref,
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
      <label className='text-nevada text-xs leading-4'>{label}</label>
      <Dropdown>
        <Dropdown.Trigger>
          <div
            className={cn(
              'hover:bg-faded-white bg-bright-grey flex min-h-11 max-w-full min-w-60 items-center gap-2 rounded-full p-3',
              {
                'bg-cayenne-red/50': invalid,
              },
            )}
          >
            <span className='flex-1 text-base leading-5.5 font-medium'>
              {selectedOptions.length > 0
                ? selectedOptions.join(', ')
                : placeholder}
            </span>
            <Icons.Down className='size-5' />
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {Children.count(children) === 0 && (
            <div className='text-nevada text-center text-sm leading-4.5'>
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
