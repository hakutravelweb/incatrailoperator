import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, formatPrice, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Journey } from '@/interfaces/journey'
import { deleteJourney } from '@/services/journey'
import { Dropdown } from '@/components/ui/dropdown'
import { toast } from '@/components/ui/toast'
import { confirmation } from '@/components/ui/confirmation'

interface Props {
  journey: Journey
  onEdit: (id: string) => void
  onItinerary: (id: string) => void
  onAskedQuestions: (id: string) => void
  onReviews: (id: string) => void
  onRefresh: () => void
}

export function JourneyItem({
  journey,
  onEdit,
  onItinerary,
  onAskedQuestions,
  onReviews,
  onRefresh,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => {
    onEdit(journey.id)
  }

  const handleItinerary = () => {
    onItinerary(journey.id)
  }

  const handleAskedQuestions = () => {
    onAskedQuestions(journey.id)
  }

  const handleReviews = () => {
    onReviews(journey.id)
  }

  const handleDelete = async () => {
    const confirmed = await confirmation({
      message: t('confirmation.message'),
      confirmText: t('confirmation.confirm'),
      declineText: t('confirmation.decline'),
    })
    if (confirmed) {
      startTransition(async () => {
        try {
          const { title } = await deleteJourney(journey.id)
          toast.success(
            t('journey.deleted-message', {
              title: title[locale],
            }),
          )
          onRefresh()
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
        className={cn('flex w-full justify-between gap-4 py-4', {
          'pointer-events-none opacity-20': isPending,
        })}
      >
        <div className='flex flex-wrap items-center gap-4'>
          <div className='bg-anti-flash-white h-25 w-full md:h-15 md:w-25'>
            {journey.photos.length > 0 && (
              <img
                className='size-full rounded-md object-cover'
                src={getFullMediaUrl(journey.photos[0])}
                alt={journey.title}
                loading='lazy'
              />
            )}
          </div>
          <div className='flex flex-col gap-px'>
            <span className='text-dark-charcoal text-sm leading-4.5'>
              {journey.slug}
            </span>
            <Link
              href={`/journey/${journey.slug}`}
              target='_blank'
              className='text-base leading-4.75 underline'
            >
              {journey.title}
            </Link>
          </div>
          {journey.labels.length > 0 && (
            <div className='rounded-sm border border-black px-2 py-1 text-xs leading-4 font-bold uppercase'>
              {journey.labels[0]}
            </div>
          )}
          <span
            className={cn('text-sm leading-4.5 font-bold', {
              'text-ue-red line-through': journey.specialPrice > 0,
            })}
          >
            {formatPrice(locale, journey.retailPrice)}
          </span>
          {journey.specialPrice > 0 && (
            <span className='text-sm leading-4.5 font-bold'>
              {formatPrice(locale, journey.specialPrice)}
            </span>
          )}
        </div>
        <Dropdown>
          <Dropdown.Trigger>
            <div className='border-chinese-white hover:bg-anti-flash-white active:bg-chinese-white flex size-8 items-center justify-center rounded-md border-2'>
              <Icons.Dots className='size-4' />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Option onClick={handleEdit}>
              {t('actions.edit')}
            </Dropdown.Option>
            <Dropdown.Option onClick={handleDelete}>
              {t('actions.delete')}
            </Dropdown.Option>
            <Dropdown.Option onClick={handleItinerary}>
              {t('actions.itinerary')}
            </Dropdown.Option>
            <Dropdown.Option onClick={handleAskedQuestions}>
              {t('actions.asked-questions')}
            </Dropdown.Option>
            <Dropdown.Option onClick={handleReviews}>
              {t('actions.reviews')}
            </Dropdown.Option>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
