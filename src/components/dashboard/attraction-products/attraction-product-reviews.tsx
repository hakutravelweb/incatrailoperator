'use client'
import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Review } from '@/interfaces/review'
import { deleteReview } from '@/services/review'
import { toast } from '@/components/ui/toast'
import { Dropdown } from '@/components/ui/dropdown'
import { confirmation } from '@/components/ui/confirmation'
import { useReviewsByAttractionProduct } from '@/hooks/use-reviews-by-attraction-product'
import { ReviewCard } from '@/components/review-card'

interface Props {
  attractionProductId: string
  onClose: () => void
}

export function AttractionProductReviews({
  attractionProductId,
  onClose,
}: Props) {
  const t = useTranslations('Dashboard')
  const reviews = useReviewsByAttractionProduct(attractionProductId)

  if (reviews.loading) {
    return (
      <div className='flex justify-center py-2'>
        <Icons.Loading className='size-6' />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='border-b-chinese-white z-overlay sticky top-0 flex gap-4 border-b bg-white py-2'>
        <button
          onClick={onClose}
          className='bg-anti-flash-white active:bg-chinese-white flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-100'
        >
          <Icons.Left className='size-6' />
        </button>
        <strong className='text-lg leading-6'>{t('review.title')}</strong>
      </div>
      <div className='flex flex-col gap-2'>
        {reviews.data.map((review) => {
          return <ReviewItem key={review.id} review={review} />
        })}
      </div>
    </div>
  )
}

interface ReviewItemProps {
  review: Review
}

function ReviewItem({ review }: ReviewItemProps) {
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

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
        className={cn('flex items-start gap-2', {
          'pointer-events-none opacity-20': isPending,
        })}
      >
        <ReviewCard key={review.id} review={review} />
        <Dropdown position='top-right'>
          <Dropdown.Trigger>
            <div className='border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex size-8 items-center justify-center rounded-md border-2'>
              <Icons.Dots className='size-4' />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Option onClick={handleDelete}>
              {t('actions.delete')}
            </Dropdown.Option>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
