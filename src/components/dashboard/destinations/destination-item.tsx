import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Destination } from '@/interfaces/journey'
import { deleteDestination } from '@/services/destination'
import { Dropdown } from '@/components/ui/dropdown'
import { toast } from '@/components/ui/toast'
import { confirmation } from '@/components/ui/confirmation'

interface Props {
  destination: Destination
  onEdit: (id: string) => void
  onRefresh: () => void
}

export function DestinationItem({ destination, onEdit, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => {
    onEdit(destination.id)
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
          const { title } = await deleteDestination(destination.id)
          toast.success(
            t('destination.deleted-message', {
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
          <div className='flex flex-col'>
            <span className='text-nevada text-sm leading-4.5'>
              {destination.department}
            </span>
            <Link
              href={`/destination/${destination.slug}`}
              target='_blank'
              className='text-base leading-5.5 underline'
            >
              {destination.title}
            </Link>
          </div>
          <div className='border-abstract-navy rounded-sm border px-2 py-1 text-xs leading-4 font-medium uppercase'>
            {t('destination.journeys-number', {
              number: destination.journeysCount,
            })}
          </div>
        </div>
        <Dropdown>
          <Dropdown.Trigger>
            <Icons.Dots className='size-5' />
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Option onClick={handleEdit}>
              {t('actions.edit')}
            </Dropdown.Option>
            <Dropdown.Option danger onClick={handleDelete}>
              {t('actions.delete')}
            </Dropdown.Option>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
