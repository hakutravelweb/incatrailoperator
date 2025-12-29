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
    <div className='relative flex flex-col gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <label className='text-base leading-4.75 font-bold'>{label}</label>
      <div
        {...getRootProps()}
        className={cn(
          'border-gray-x11 rounded-xl border border-dashed bg-white',
          {
            'bg-anti-flash-white': isDragActive,
            'rounded-none border-solid bg-black': pdf,
            'border-ue-red': invalid,
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
                <Icons.PdfPlus className='size-6' />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={open}
            className='flex cursor-pointer flex-col items-center gap-6 p-6'
          >
            <span className='text-center text-base leading-5.25 font-bold'>
              {t('title-pdf')}
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
              {t('supported-pdf-format')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
