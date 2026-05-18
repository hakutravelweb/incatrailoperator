'use client'
import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn, getFullMediaUrl } from '@/lib/utils'
import { Button } from './button'

interface Props {
  ref?: RefCallBack
  label: string
  value: File[]
  onChange: (value: File[]) => void
  invalid: boolean
  previewPhotos?: string[]
  onDeletePhotos?: (value: string[]) => void
  deletedPhotos?: string[]
}

export function UploadPhotos({
  ref,
  label,
  value,
  onChange,
  onDeletePhotos,
  invalid,
  previewPhotos = [],
  deletedPhotos = [],
}: Props) {
  const t = useTranslations('Upload')
  const [photos, setPhotos] = useState<string[]>([])

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const photos = await Promise.all(
        acceptedFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(file)
          })
        }),
      )
      setPhotos([...photos])
      onChange([...value, ...acceptedFiles])
    },
    [onChange],
  )
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
      'image/svg+xml': ['.svg'],
    },
  })

  const handleDelete = (index: number) => () => {
    photos.splice(index, 1)
    value.splice(index, 1)
    setPhotos([...photos])
    onChange([...value])
  }

  const handleDeletePhoto = (photo: string) => () => {
    if (deletedPhotos.includes(photo)) {
      const index = deletedPhotos.indexOf(photo)
      deletedPhotos.splice(index, 1)
    } else {
      deletedPhotos.push(photo)
    }
    onDeletePhotos?.([...deletedPhotos])
  }

  return (
    <div className='relative flex flex-col gap-1'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-nevada text-xs leading-4'>{label}</label>
      {deletedPhotos.length > 0 && (
        <span className='text-cayenne-red my-2 text-sm leading-4.5 font-medium'>
          {t('deleted-message', {
            number: deletedPhotos.length,
          })}
        </span>
      )}
      <div className='flex flex-col gap-4'>
        {(previewPhotos.length > 0 || photos.length > 0) && (
          <div className='grid-cols-auto-fill grid gap-2'>
            {previewPhotos.map((photo, index) => {
              const activeDeleted = deletedPhotos.includes(photo)

              return (
                <div
                  key={index}
                  className='bg-abstract-navy before:bg-abstract-navy/40 relative aspect-4/3 transition-opacity duration-200 before:invisible before:absolute before:z-2 before:size-full before:content-[""] hover:before:visible'
                >
                  <img
                    className='size-full object-cover object-center'
                    src={getFullMediaUrl(photo)}
                    alt={label}
                    loading='lazy'
                  />
                  <button
                    onClick={handleDeletePhoto(photo)}
                    className='hover:bg-faded-white bg-bright-grey absolute top-2 left-2 z-2 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
                  >
                    <div
                      className={cn('bg-dark-jade size-4 rounded-full', {
                        'bg-cayenne-red': activeDeleted,
                      })}
                    />
                  </button>
                </div>
              )
            })}
            {photos.map((photo, index) => {
              return (
                <div
                  key={index}
                  className='bg-abstract-navy before:bg-abstract-navy/40 relative aspect-4/3 transition-opacity duration-200 before:invisible before:absolute before:z-2 before:size-full before:content-[""] hover:before:visible'
                >
                  <img
                    className='size-full object-cover object-center'
                    src={photo}
                    alt={label}
                    loading='lazy'
                  />
                  <button
                    onClick={handleDelete(index)}
                    className='hover:bg-faded-white bg-bright-grey absolute top-2 right-2 z-2 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
                  >
                    <Icons.Close className='size-6' />
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <div
          {...getRootProps()}
          className={cn(
            'border-pewter-metallic rounded-lg border border-dashed bg-white',
            {
              'bg-faded-white': isDragActive,
              'border-cayenne-red': invalid,
            },
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-6 p-6'>
            <span className='text-base leading-5.5 font-medium'>
              {t('title-plural')}
            </span>
            <div className='relative flex items-center justify-center'>
              <div className='bg-faded-white h-px w-50 md:w-100' />
              <span className='text-nevada absolute bg-white px-2 text-base leading-5.5'>
                {t('or')}
              </span>
            </div>
            <Button variant='outline' widthFit onClick={open}>
              {t('select-from-your-computer')}
            </Button>
            <span className='text-nevada text-sm leading-4.5'>
              {t('supported-formats')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
