'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { calculateReadingTime, formatDate } from '@/lib/utils'
import { Link } from '@/i18n/routing'
import { Article } from '@/interfaces/article'

interface Props {
  article: Article
}

export function ArticleHeader({ article }: Props) {
  const locale = useLocale()
  const t = useTranslations('Articles')
  const url = `${process.env.APP_URL}/es/article/${article.slug}`

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-1'>
        <Link
          href='/'
          className='text-dark-charcoal text-base leading-5 hover:underline'
        >
          {t('country')}
        </Link>
        <Icons.Right className='text-dav-ys-grey size-4' />
        <Link
          href='/articles'
          className='text-dark-charcoal text-base leading-5 hover:underline'
        >
          {t('articles')}
        </Link>
      </div>
      <div className='flex flex-col gap-2'>
        <span className='text-inferno text-base leading-5 font-bold'>
          {article.category.title}
        </span>
        <strong className='text-2xl leading-7.25 font-black md:text-[28px] md:leading-8.5'>
          {article.title}
        </strong>
        <span className='text-dark-charcoal text-base leading-5'>
          {article.introduction}
        </span>
        <div className='flex flex-wrap gap-2'>
          {article.labels.map((label, index) => {
            return (
              <div
                key={index}
                className='border-chinese-white rounded-full border-2 bg-white px-3 py-1 text-sm leading-4.5 font-medium'
              >
                {label}
              </div>
            )
          })}
        </div>
      </div>
      <hr className='border-chinese-white border-t' />
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <img
            className='size-8 rounded-full object-cover'
            src='/logos/logo.svg'
            alt={article.author.name}
          />
          <div className='flex flex-col gap-px'>
            <strong className='text-base leading-5'>
              {article.author.name}
            </strong>
            <span className='text-dark-charcoal text-sm leading-4.5'>
              {formatDate({
                locale,
                date: article.createdAt,
                options: {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                },
              })}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Icons.Clock className='text-dav-ys-grey size-5' />
          <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
            {t('reading-time', {
              time: calculateReadingTime(article.content),
            })}
          </span>
        </div>
      </div>
      <hr className='border-chinese-white border-t' />
      <div className='flex items-center gap-4'>
        <span className='text-dav-ys-grey text-sm leading-4.5 font-medium'>
          {t('share')}
        </span>
        <div className='flex items-center gap-1'>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target='_blank'
          >
            <Icons.Facebook className='size-6' />
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?url=${url}&text=${article.title}`}
            target='_blank'
          >
            <Icons.Twitter className='size-6' />
          </Link>
          <Link href={`https://wa.me/?text=${url}`} target='_blank'>
            <Icons.Whatsapp className='size-6' />
          </Link>
        </div>
      </div>
    </div>
  )
}
