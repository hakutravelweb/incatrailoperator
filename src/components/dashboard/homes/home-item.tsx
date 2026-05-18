import { useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Locale } from '@/i18n/config'
import { Home } from '@/interfaces/home'
import { deleteHome } from '@/services/home'
import { Dropdown } from '@/components/ui/dropdown'
import { toast } from '@/components/ui/toast'
import { confirmation } from '@/components/ui/confirmation'

interface Props {
  home: Home
  onEdit: (id: string) => void
  onRefresh: () => void
}

export function HomeItem({ home, onEdit, onRefresh }: Props) {
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => {
    onEdit(home.id)
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
          const { title } = await deleteHome(home.id)
          toast.success(
            t('home.deleted-message', {
              title,
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
          <div className='bg-bright-grey h-25 w-full overflow-hidden rounded-md md:h-15 md:w-25'>
            <img
              className='size-full object-cover'
              src={getFullMediaUrl(home.photo)}
              alt={home.title}
              loading='lazy'
            />
          </div>
          <div className='flex flex-col'>
            <span className='text-nevada text-sm leading-4.5'>
              {home.locale}
            </span>
            <Link
              href='/'
              locale={home.locale}
              target='_blank'
              className='text-base leading-5.5 font-medium underline'
            >
              {home.title}
            </Link>
          </div>
          <div className='border-abstract-navy rounded-sm border px-2 py-1 text-xs leading-4 font-medium uppercase'>
            {home.subtitle}
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
