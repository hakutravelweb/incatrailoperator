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
    <div className='flex flex-col items-start gap-px'>
      {label && (
        <label className='text-base leading-5.25 font-medium'>{label}</label>
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
                      'hover:border-chinese-white field-sizing-content w-full resize-none rounded-md border-2 border-white bg-white px-2 py-1 text-sm leading-4.5 outline-hidden focus:border-black',
                      {
                        'border-ue-red': !!errors?.[props.key!]?.message,
                      },
                    )}
                    value={value}
                    onChange={handleChange(props.key!)}
                  />
                  <Dropdown>
                    <Dropdown.Trigger>
                      <Icons.Dots className='size-5' />
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
