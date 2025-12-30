'use client'
import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn, getFullMediaUrl } from '@/lib/utils'

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
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-4.75 font-bold'>{label}</label>
      {deletedPhotos.length > 0 && (
        <span className='text-ue-red my-2 text-sm leading-4.5 font-medium'>
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
                  className='relative aspect-4/3 bg-black transition-opacity duration-100 before:invisible before:absolute before:z-2 before:size-full before:bg-black/40 before:content-[""] hover:before:visible'
                >
                  <img
                    className='size-full object-cover object-center'
                    src={getFullMediaUrl(photo)}
                    alt={label}
                    loading='lazy'
                  />
                  <button
                    onClick={handleDeletePhoto(photo)}
                    className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2 left-2 z-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
                  >
                    <div
                      className={cn('bg-inferno size-4 rounded-full', {
                        'bg-ue-red': activeDeleted,
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
                  className='relative aspect-4/3 bg-black transition-opacity duration-100 before:invisible before:absolute before:z-2 before:size-full before:bg-black/40 before:content-[""] hover:before:visible'
                >
                  <img
                    className='size-full object-cover object-center'
                    src={photo}
                    alt={label}
                    loading='lazy'
                  />
                  <button
                    onClick={handleDelete(index)}
                    className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2 right-2 z-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
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
            'border-gray-x11 rounded-xl border border-dashed bg-white',
            {
              'bg-anti-flash-white': isDragActive,
              'border-ue-red': invalid,
            },
          )}
        >
          <input {...getInputProps()} />
          <div
            onClick={open}
            className='flex cursor-pointer flex-col items-center gap-6 p-6'
          >
            <span className='text-center text-base leading-5.25 font-bold'>
              {t('title-plural')}
            </span>
            <div className='relative flex items-center justify-center'>
              <div className='bg-chinese-white h-px w-50 md:w-100' />
              <span className='absolute bg-white px-2 text-lg leading-5.5 font-bold'>
                {t('or')}
              </span>
            </div>
            <div className='hover:bg-dark-charcoal active:bg-dav-ys-grey flex rounded-full bg-black px-6 py-3.5 text-center text-base leading-5.25 font-bold text-white active:text-white/50'>
              {t('select-from-your-computer')}
            </div>
            <span className='text-dark-charcoal text-sm leading-4.5'>
              {t('supported-formats')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
