import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Category } from '@/interfaces/journey'
import { deleteCategory } from '@/services/category'
import { Dropdown } from '@/components/ui/dropdown'
import { toast } from '@/components/ui/toast'
import { confirmation } from '@/components/ui/confirmation'

interface Props {
  category: Category
  onEdit: (id: string) => void
  onRefresh: () => void
}

export function CategoryItem({ category, onEdit, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => {
    onEdit(category.id)
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
          const { title } = await deleteCategory(category.id)
          toast.success(
            t('category.deleted-message', {
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
          <span className='text-base leading-5.5'>{category.title}</span>
          <div className='border-abstract-navy rounded-sm border px-2 py-1 text-xs leading-4 font-medium uppercase'>
            {t('category.journeys-number', {
              number: category.journeysCount,
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
