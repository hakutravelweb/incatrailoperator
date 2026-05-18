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
  label?: string
  value: string[]
  onChange: (value: string[]) => void
  errors?: Merge<FieldError, (FieldError | undefined)[]>
  deleteText: string
  addListText: string
}

export function InputList({
  ref,
  label,
  value,
  onChange,
  errors,
  deleteText,
  addListText,
}: Props) {
  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value
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
    <div className='flex flex-col gap-1'>
      {label && (
        <label className='text-nevada text-xs leading-4'>{label}</label>
      )}
      <div className='flex flex-col gap-2'>
        {value.length > 0 && (
          <List
            values={value}
            onChange={handleChangeMove}
            renderList={({ children, props, isDragged }) => {
              return (
                <div
                  {...props}
                  className={cn(
                    'border-faded-white divide-faded-white divide-y rounded-lg border',
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
                  className={cn('flex items-center gap-1 px-2 py-1', {
                    'shadow-main rounded-lg': isDragged || isSelected,
                  })}
                >
                  <button
                    data-movable-handle
                    className={cn(
                      'flex size-6 cursor-pointer items-center justify-center',
                      {
                        'cursor-grabbing': isDragged,
                      },
                    )}
                  >
                    <Icons.Drag className='size-5' />
                  </button>
                  <textarea
                    ref={ref}
                    className={cn(
                      'focus:bg-bright-grey/50 field-sizing-content w-full resize-none rounded-sm px-2 py-1 text-sm leading-4.5 outline-hidden transition-colors duration-200',
                      {
                        'border-cayenne-red': !!errors?.[props.key!]?.message,
                      },
                    )}
                    value={value}
                    onChange={handleChange(props.key!)}
                  />
                  <Dropdown>
                    <Dropdown.Trigger>
                      <Icons.Dots className='size-4' />
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
          variant='outline'
          widthFit
          invalid={!!errors?.message}
          onClick={handleAdd}
        >
          {addListText}
        </Button>
      </div>
    </div>
  )
}
