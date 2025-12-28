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
  value: File | null
  onChange: (value: File | null) => void
  invalid: boolean
  previewPhoto?: string | null
}

export function UploadPhoto({
  ref,
  label,
  value,
  onChange,
  invalid,
  previewPhoto,
}: Props) {
  const t = useTranslations('UploadPhoto')
  const [photo, setPhoto] = useState<string>('')

  useEffect(() => {
    if (previewPhoto) {
      setPhoto(getFullMediaUrl(previewPhoto))
    }
  }, [previewPhoto])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    },
    [onChange],
  )
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    maxFiles: 1,
    noClick: true,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
    },
  })

  const handleDelete = () => {
    if (previewPhoto) {
      setPhoto(getFullMediaUrl(previewPhoto))
    } else {
      setPhoto('')
    }
    onChange(null)
  }

  return (
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-4.75 font-bold'>{label}</label>
      <div
        {...getRootProps()}
        className={cn(
          'border-gray-x11 rounded-xl border border-dashed bg-white',
          {
            'bg-anti-flash-white': isDragActive,
            'rounded-none border-solid bg-black': photo,
            'border-ue-red': invalid,
          },
        )}
      >
        <input {...getInputProps()} />
        {photo ? (
          <div className='relative'>
            <div className='aspect-video'>
              <img
                className='size-full object-contain object-center'
                src={photo}
                alt={label}
                loading='lazy'
              />
            </div>
            {value ? (
              <button
                onClick={handleDelete}
                className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
              >
                <Icons.Close className='size-6' />
              </button>
            ) : (
              <button
                onClick={open}
                className='hover:bg-anti-flash-white active:bg-chinese-white absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100'
              >
                <Icons.PhotoPlus className='size-6' />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={open}
            className='flex cursor-pointer flex-col items-center gap-6 p-6'
          >
            <span className='text-center text-base leading-5.25 font-bold'>
              {t('title')}
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
        )}
      </div>
    </div>
  )
}
