'use client'
import { useState, useCallback, useEffect } from 'react'
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
}

export function UploadPhotos({
  ref,
  label,
  value,
  onChange,
  invalid,
  previewPhotos = [],
}: Props) {
  const t = useTranslations('UploadPhoto')
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    if (previewPhotos.length > 0) {
      const photos = previewPhotos.map((photo) => getFullMediaUrl(photo))
      setPhotos(photos)
    }
  }, [previewPhotos.length])

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
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
  })

  const handleDelete = (index: number) => () => {
    photos.splice(index, 1)
    value.splice(index, 1)
    setPhotos([...photos])
    onChange([...value])
  }

  return (
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-4.75 font-bold'>{label}</label>
      <div className='flex flex-col gap-4'>
        {photos.length > 0 && (
          <div className='grid-cols-photos grid gap-2'>
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
                  {!previewPhotos.includes(photo) && (
                    <button
                      onClick={handleDelete(index)}
                      className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2 right-2 z-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
                    >
                      <Icons.Close className='size-6' />
                    </button>
                  )}
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
