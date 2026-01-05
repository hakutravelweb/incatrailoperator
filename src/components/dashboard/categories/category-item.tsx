import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Category } from '@/interfaces/attraction-product'
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
          <span className='text-base leading-4.75'>{category.title}</span>
          <div className='rounded-sm border border-black px-2 py-1 text-xs leading-4 font-bold uppercase'>
            {t('category.attractions-number', {
              number: category.attractionProductsCount,
            })}
          </div>
        </div>
        <Dropdown position='top-right'>
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
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
