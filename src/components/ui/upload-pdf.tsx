'use client'
import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn, getFullMediaUrl } from '@/lib/utils'
import { Button } from './button'

interface Props {
  ref?: RefCallBack
  label: string
  value: File | null
  onChange: (value: File | null) => void
  invalid: boolean
  previewPdf?: string | null
}

export function UploadPdf({
  ref,
  label,
  value,
  onChange,
  invalid,
  previewPdf,
}: Props) {
  const t = useTranslations('Upload')
  const [pdf, setPdf] = useState<string>('')

  useEffect(() => {
    if (previewPdf) {
      setPdf(getFullMediaUrl(previewPdf))
    }
  }, [previewPdf])

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      const url = URL.createObjectURL(file)
      setPdf(url)
      onChange(file)
    },
    [onChange],
  )
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    maxFiles: 1,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
    },
  })

  const handleDelete = () => {
    if (previewPdf) {
      setPdf(getFullMediaUrl(previewPdf))
    } else {
      setPdf('')
    }
    URL.revokeObjectURL(pdf)
    onChange(null)
  }

  return (
    <div className='relative flex flex-col gap-1'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-nevada text-xs leading-4'>{label}</label>
      <div
        {...getRootProps()}
        className={cn(
          'border-pewter-metallic rounded-lg border border-dashed bg-white',
          {
            'bg-faded-white': isDragActive,
            'bg-abstract-navy rounded-none border-solid': pdf,
            'border-cayenne-red': invalid,
          },
        )}
      >
        <input {...getInputProps()} />
        {pdf ? (
          <div className='relative'>
            <div className='aspect-video'>
              <embed
                className='size-full object-contain object-center'
                type='application/pdf'
                src={pdf}
              />
            </div>
            <div className='absolute top-2 right-2 z-2'>
              {value ? (
                <button
                  onClick={handleDelete}
                  className='hover:bg-faded-white bg-bright-grey flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
                >
                  <Icons.Close className='size-6' />
                </button>
              ) : (
                <button
                  onClick={open}
                  className='hover:bg-faded-white bg-bright-grey flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200'
                >
                  <Icons.PdfPlus className='size-6' />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-6 p-6'>
            <span className='text-base leading-5.5 font-medium'>
              {t('title-pdf')}
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
              {t('supported-pdf-format')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
