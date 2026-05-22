'use client'
import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useDropzone } from 'react-dropzone'
import { RefCallBack } from 'react-hook-form'
import { Icons } from '@/icons/icon'
import { cn, getFullMediaUrl } from '@/lib/utils'
import { Button, ButtonLink } from './button'

interface Props {
  ref?: RefCallBack
  label: string
  value: File | null
  onChange: (value: File | null) => void
  invalid: boolean
  previewPdf?: string | null
  deletedPdf?: string
  onToggleDeletePdf?: () => void
}

export function UploadPdf({
  ref,
  label,
  value,
  onChange,
  invalid,
  previewPdf,
  deletedPdf,
  onToggleDeletePdf,
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
            'border-cayenne-red': invalid,
          },
        )}
      >
        <input {...getInputProps()} />
        {pdf ? (
          <div className='flex items-center justify-center gap-2 p-4'>
            {previewPdf && onToggleDeletePdf && !value && (
              <button
                onClick={onToggleDeletePdf}
                className='bg-cayenne-red flex size-10 cursor-pointer items-center justify-center rounded-full text-white'
              >
                {deletedPdf ? (
                  <Icons.Check className='size-6' />
                ) : (
                  <Icons.TrashCan className='size-6' />
                )}
              </button>
            )}
            <ButtonLink
              variant={pdf.includes('blob:') ? 'secondary' : 'outline'}
              widthFit
              disabled={!!deletedPdf}
              icon='Pdf'
              href={pdf}
              target='_blank'
            >
              {t('view-pdf')}
            </ButtonLink>
            {value && !deletedPdf && (
              <button
                onClick={handleDelete}
                className='bg-abstract-navy flex size-10 cursor-pointer items-center justify-center rounded-full text-white'
              >
                <Icons.Close className='size-6' />
              </button>
            )}
            {!value && !deletedPdf && (
              <button
                onClick={open}
                className='bg-faded-white flex size-10 cursor-pointer items-center justify-center rounded-full'
              >
                <Icons.PdfPlus className='size-6' />
              </button>
            )}
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
