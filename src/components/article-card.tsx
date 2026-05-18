import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { formatDate, getFullMediaUrl } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Article } from '@/interfaces/article'

interface Props {
  article: Article
}

export function ArticleCard({ article }: Props) {
  const locale = useLocale()
  const t = useTranslations('Articles')

  return (
    <Link
      href={`/article/${article.slug}`}
      className='border-faded-white overflow-hidden rounded-2xl border bg-white'
    >
      <div className='bg-bright-grey relative aspect-video'>
        <img
          className='size-full object-cover'
          src={getFullMediaUrl(article.photo)}
          alt={article.title}
          loading='lazy'
        />
        <div className='bg-dark-jade absolute top-2 left-2 rounded-md px-2 py-1 text-xs leading-4 font-medium text-white'>
          {article.category.title}
        </div>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <span className='text-base leading-5.5 font-medium'>
          {article.title}
        </span>
        <span className='text-sm leading-4.5'>{article.introduction}</span>
        <hr className='border-faded-white border-t' />
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <img
              className='size-8 rounded-full object-cover'
              src='/logos/logo.svg'
              alt={article.author.name}
            />
            <div className='flex flex-col gap-px'>
              <span className='text-sm leading-4.5 font-medium'>
                {article.author.name}
              </span>
              <span className='text-nevada text-xs leading-4'>
                {formatDate({
                  locale,
                  date: new Date(article.createdAt),
                  options: {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  },
                })}
              </span>
            </div>
          </div>
          <span className='text-nevada text-sm leading-4.5'>8.5k</span>
        </div>
        <hr className='border-faded-white border-t' />
        <div className='flex items-center justify-between gap-4'>
          <span className='text-sm leading-4.5 font-medium'>{t('share')}</span>
          <div className='flex items-center gap-1'>
            <Icons.Facebook className='size-6' />
            <Icons.Twitter className='size-6' />
            <Icons.Whatsapp className='size-6' />
          </div>
        </div>
      </div>
    </Link>
  )
}
