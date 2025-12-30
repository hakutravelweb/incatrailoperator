import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Article } from '@/interfaces/article'
import { deleteArticle } from '@/services/article'
import { Dropdown } from '@/components/ui/dropdown'
import { toast } from '@/components/ui/toast'
import { confirmation } from '@/components/ui/confirmation'

interface Props {
  article: Article
  onEdit: (id: string) => void
  onRefresh: () => void
}

export function ArticleItem({ article, onEdit, onRefresh }: Props) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => {
    onEdit(article.id)
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
          const { title } = await deleteArticle(article.id)
          toast.success(
            t('article.deleted-message', {
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
            <img
              className='size-full rounded-md object-cover'
              src={getFullMediaUrl(article.photo)}
              alt={article.title}
              loading='lazy'
            />
          </div>
          <div className='flex flex-col gap-px'>
            <span className='text-dark-charcoal text-sm leading-4.5'>
              {article.slug}
            </span>
            <Link
              href={`/articles/${article.slug}`}
              target='_blank'
              className='text-base leading-4.75 underline'
            >
              {article.title}
            </Link>
          </div>
          {article.labels.length > 0 && (
            <div className='rounded-sm border border-black px-2 py-1 text-xs leading-4 font-bold uppercase'>
              {article.labels[0]}
            </div>
          )}
          <div className='flex flex-col gap-px'>
            <span className='text-base leading-4.75 underline'>
              {article.author.name}
            </span>
            <span className='text-dark-charcoal text-sm leading-4.5'>
              {article.author.email}
            </span>
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
