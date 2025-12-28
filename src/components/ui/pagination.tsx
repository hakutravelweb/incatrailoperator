'use client'
import { useMemo, PropsWithChildren } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'

interface Props {
  limit: number
  offset: number
  total: number
  onOffset: (value: number) => void
}

export function Pagination({ limit, offset, total, onOffset }: Props) {
  const t = useTranslations('Dashboard')
  const currentPage = Math.floor(offset / limit) + 1
  const start = (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, total)
  const pages = Math.ceil(total / limit)

  const handleOffset = (value: number) => () => {
    onOffset(value)
  }

  const pageList = useMemo(() => {
    if (currentPage <= 3) {
      return [
        ...Array(Math.min(3, pages))
          .fill(0)
          .map((_, i) => i + 1),
        ...(pages > 3 ? ['...', pages] : []),
      ]
    } else if (currentPage >= pages - 2) {
      return [
        1,
        '...',
        ...Array(3)
          .fill(0)
          .map((_, i) => pages - 2 + i),
      ].filter((page) => typeof page === 'number' && page <= pages && page >= 1)
    } else {
      return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        pages,
      ]
    }
  }, [currentPage, pages])

  return (
    <div className='flex flex-col gap-4 py-2'>
      <div className='flex flex-col gap-5 md:flex-row md:justify-center md:gap-4'>
        {pages > 1 && (
          <div className='flex justify-center gap-11 md:contents'>
            {currentPage > 1 && (
              <div className='order-1 md:order-1'>
                <ButtonPage
                  onClick={handleOffset(Math.max(0, offset - limit))}
                  icon='ArrowLeft'
                />
              </div>
            )}
            {currentPage < pages && (
              <div className='order-2 md:order-3'>
                <ButtonPage
                  onClick={handleOffset(
                    Math.min((pages - 1) * limit, offset + limit),
                  )}
                  icon='ArrowRight'
                />
              </div>
            )}
          </div>
        )}
        <div className='flex flex-wrap justify-center gap-4 md:order-2'>
          {pageList.map((page, index) => {
            const active = page === currentPage

            if (typeof page === 'string') {
              return (
                <span
                  key={index}
                  className='self-center text-base leading-5.25 font-bold'
                >
                  {page}
                </span>
              )
            }

            return (
              <ButtonPage
                key={index}
                onClick={handleOffset((page - 1) * limit)}
                active={active}
              >
                {page}
              </ButtonPage>
            )
          })}
        </div>
      </div>
      <div className='text-dark-charcoal text-center text-sm leading-4.5'>
        {t('pagination', { start, end, total })}
      </div>
    </div>
  )
}

interface ButtonPageProps {
  icon?: keyof Pick<typeof Icons, 'ArrowLeft' | 'ArrowRight'>
  active?: boolean
  onClick: () => void
}

function ButtonPage({
  onClick,
  icon,
  active,
  children,
}: PropsWithChildren<ButtonPageProps>) {
  const Icon = icon ? Icons[icon] : null

  const handleClick = () => {
    if (active) return
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'hover:bg-anti-flash-white active:bg-chinese-white flex size-10 cursor-pointer items-center justify-center rounded-full bg-white transition-colors duration-100',
        {
          'border-2 border-black': Icon,
          'hover:bg-dark-charcoal active:bg-dav-ys-grey bg-black text-white active:text-white/50':
            active,
        },
      )}
    >
      {Icon ? (
        <Icon className='size-6' />
      ) : (
        <span className='text-base leading-5.25 font-bold'>{children}</span>
      )}
    </button>
  )
}
