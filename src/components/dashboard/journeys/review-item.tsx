import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, formatDate } from '@/lib/utils'
import { Review } from '@/interfaces/review'
import { deleteReview } from '@/services/review'
import { Rating } from '@/components/journey/rating'
import { confirmation } from '@/components/ui/confirmation'
import { toast } from '@/components/ui/toast'
import { Dropdown } from '@/components/ui/dropdown'

interface Props {
  review: Review
}

export function ReviewItem({ review }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

  const bgColors = [
    'bg-inferno',
    'bg-blue-fire',
    'bg-dark-jade',
    'bg-abstract-navy',
    'bg-camouflage-blue',
  ] as const

  const index = review.traveller.fullname.charCodeAt(0) % bgColors.length
  const bgClass = bgColors[index]

  const handleDelete = async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      startTransition(async () => {
        try {
          const { traveller } = await deleteReview(review.id)
          toast.success(
            t('review.deleted-message', {
              fullname: traveller.fullname,
            }),
          )
        } catch {
          toast.error('ERROR INTERNAL SERVER')
        }
      })
    }
  }

  return (
    <div className='relative flex items-center justify-center'>
      {isPending && <Icons.Loading className='z-overlay absolute size-6' />}
      <div
        className={cn('flex flex-1 flex-col gap-4 py-6', {
          'pointer-events-none opacity-20': isPending,
        })}
      >
        <div className='flex justify-between gap-4'>
          <div className='flex items-center gap-1'>
            <Rating rating={review.rating} />
            <span className='text-sm leading-4'>{review.rating}</span>
          </div>
          <Dropdown>
            <Dropdown.Trigger>
              <Icons.Dots className='size-5' />
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Option danger onClick={handleDelete}>
                {t('actions.delete')}
              </Dropdown.Option>
            </Dropdown.Content>
          </Dropdown>
        </div>
        <div className='flex items-center gap-4'>
          <div
            className={`${bgClass} flex size-10 items-center justify-center rounded-full`}
          >
            <span className='text-2xl leading-7.5 font-bold text-white uppercase'>
              {review.traveller.fullname.charAt(0)}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm leading-5 font-medium'>
              {review.traveller.fullname} - {review.traveller.country}
            </span>
            <span className='text-nevada text-sm leading-5'>
              {formatDate({
                locale,
                date: new Date(review.createdAt),
                options: {
                  month: 'long',
                  year: 'numeric',
                },
              })}
            </span>
          </div>
        </div>
        <span className='text-base leading-5.5'>{review.comment}</span>
      </div>
    </div>
  )
}
