'use client'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { useCategories } from '@/hooks/use-categories'
import { useArticlesCategoryPagination } from '@/hooks/use-articles-category-pagination'
import { Pagination } from './ui/pagination'
import { ArticleCard } from './article-card'

export function ArticlesCategory() {
  const t = useTranslations('Articles')
  const categories = useCategories()
  const articlesCategory = useArticlesCategoryPagination()

  const handleCategory = (categoryId: string) => () => {
    if (articlesCategory.categoryId === categoryId) {
      articlesCategory.onCategory('')
    } else {
      articlesCategory.onCategory(categoryId)
    }
  }

  return (
    <div className='grid grid-cols-1 items-start gap-6 md:grid-cols-[30%_1fr]'>
      <div className='border-faded-white flex flex-col gap-2 rounded-2xl border bg-white p-4 md:sticky md:top-2'>
        <span className='text-lg leading-6 font-medium'>{t('categories')}</span>
        <div className='flex flex-col'>
          {categories.data.length === 0 && (
            <span className='text-nevada text-sm leading-4.5'>
              {t('categories-empty')}
            </span>
          )}
          {categories.loading && (
            <div className='flex justify-center py-2'>
              <Icons.Loading className='size-6' />
            </div>
          )}
          {categories.data.map((category) => {
            const active = articlesCategory.categoryId === category.id

            return (
              <div
                key={category.id}
                onClick={handleCategory(category.id)}
                className='flex min-h-12 cursor-pointer items-center gap-2 py-2'
              >
                <div
                  className={cn(
                    'border-pewter-metallic flex size-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
                    {
                      'border-blue-fire': active,
                    },
                  )}
                >
                  {active && (
                    <div className='bg-blue-fire size-3 rounded-full' />
                  )}
                </div>
                <span className='flex-1 text-left text-base leading-5.5'>
                  {category.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {!articlesCategory.loading && articlesCategory.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-nevada text-sm leading-4.5'>
              {t('empty-message')}
            </span>
          </div>
        )}
        {articlesCategory.loading && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {articlesCategory.data.map((article) => {
            return <ArticleCard key={article.id} article={article} />
          })}
        </div>
        <Pagination
          limit={articlesCategory.limit}
          offset={articlesCategory.offset}
          total={articlesCategory.total}
          onOffset={articlesCategory.onOffset}
        />
      </div>
    </div>
  )
}
