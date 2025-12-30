'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { ArticleView } from '@/interfaces/article'
import { useArticlesPagination } from '@/hooks/use-articles-pagination'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { ArticleItem } from './article-item'
import { ArticleCreate } from './article-create'
import { ArticleUpdate } from './article-update'

export function Articles() {
  const t = useTranslations('Dashboard')
  const articles = useArticlesPagination()
  const [articleId, setArticleId] = useState<string>('')
  const [articleView, setArticleView] = useState<ArticleView>('ARTICLES')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    articles.onSearch(text)
  }

  const handleChangeView = (view: ArticleView) => (id?: string) => {
    if (id) {
      setArticleId(id)
    }
    setArticleView(view)
  }

  if (articleView === 'EDIT') {
    return (
      <ArticleUpdate
        articleId={articleId}
        onClose={handleChangeView('ARTICLES')}
        onRefresh={articles.onRefresh}
      />
    )
  }

  if (articleView === 'CREATE') {
    return (
      <ArticleCreate
        onClose={handleChangeView('ARTICLES')}
        onRefresh={articles.onRefresh}
      />
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
        <div className='divide-chinese-white border-chinese-white flex w-75 divide-x-2 rounded-sm border-2 focus-within:divide-black focus-within:border-black'>
          <div className='p-2'>
            <Icons.Search className='size-5' />
          </div>
          <input
            type='text'
            className='text-dark-charcoal flex-1 p-2 text-sm leading-4.5 outline-hidden'
            value={articles.search}
            onChange={handleChange}
            placeholder={t('article.search-placeholder')}
          />
        </div>
        <Button
          variant='action'
          icon='Plus'
          onClick={handleChangeView('CREATE')}
        >
          {t('article.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!articles.loading && articles.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('article.empty-message')}
            </span>
          </div>
        )}
        {articles.loading && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {articles.data.map((article) => {
          return (
            <ArticleItem
              key={article.id}
              article={article}
              onEdit={handleChangeView('EDIT')}
              onRefresh={articles.onRefresh}
            />
          )
        })}
      </div>
      <Pagination
        limit={articles.limit}
        offset={articles.offset}
        total={articles.total}
        onOffset={articles.onOffset}
      />
    </div>
  )
}
