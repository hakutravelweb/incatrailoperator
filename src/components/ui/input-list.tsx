'use client'
import { ChangeEvent } from 'react'
import { Merge, FieldError, RefCallBack } from 'react-hook-form'
import { List, OnChangeMeta, arrayMove } from 'react-movable'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Dropdown } from './dropdown'

interface Props {
  ref?: RefCallBack
  label: string
  value: string[]
  onChange: (value: string[]) => void
  errors?: Merge<FieldError, (FieldError | undefined)[]>
  translate?: boolean
  deleteText: string
  addListText: string
}

export function InputList({
  ref,
  label,
  value,
  onChange,
  errors,
  translate,
  deleteText,
  addListText,
}: Props) {
  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      const text: string = event.target.value
      value[index] = text
      onChange([...value])
    }

  const handleAdd = () => {
    value.push('')
    onChange([...value])
  }

  const handleDelete = (index: number) => () => {
    value.splice(index, 1)
    onChange([...value])
  }

  const handleChangeMove = (meta: OnChangeMeta) => {
    onChange(arrayMove(value, meta.oldIndex, meta.newIndex))
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
      <div className='flex flex-col items-start gap-4'>
        {value.length > 0 && (
          <List
            values={value}
            onChange={handleChangeMove}
            renderList={({ children, props, isDragged }) => {
              return (
                <div
                  {...props}
                  className={cn(
                    'border-chinese-white divide-chinese-white divide-y-2 rounded-md border-2',
                    {
                      'cursor-grabbing': isDragged,
                    },
                  )}
                >
                  {children}
                </div>
              )
            }}
            renderItem={({ value, props, isDragged, isSelected }) => {
              const { key, ...rest } = props

              return (
                <div
                  key={key}
                  {...rest}
                  className={cn('flex items-center gap-2 px-3 py-1', {
                    'shadow-deep rounded-md': isDragged || isSelected,
                  })}
                >
                  <button
                    data-movable-handle
                    className={cn(
                      'bg-anti-flash-white flex size-6 cursor-pointer items-center justify-center rounded-md',
                      {
                        'cursor-grabbing': isDragged,
                      },
                    )}
                  >
                    <Icons.Drag className='text-dark-charcoal size-5' />
                  </button>
                  <textarea
                    ref={ref}
                    className={cn(
                      'hover:border-chinese-white field-sizing-content w-full resize-none rounded-md border-2 border-white bg-white px-2 py-1 text-sm leading-4.5 outline-hidden focus:border-black',
                      {
                        'border-ue-red': !!errors?.[props.key!]?.message,
                      },
                    )}
                    value={value}
                    onChange={handleChange(props.key!)}
                  />
                  <Dropdown position='top-right'>
                    <Dropdown.Trigger>
                      <div className='border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex size-8 items-center justify-center rounded-md border-2'>
                        <Icons.Dots className='size-4' />
                      </div>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Option onClick={handleDelete(props.key!)}>
                        {deleteText}
                      </Dropdown.Option>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              )
            }}
          />
        )}
        <Button
          variant='action'
          invalid={!!errors?.message}
          onClick={handleAdd}
        >
          {addListText}
        </Button>
      </div>
    </div>
  )
}
