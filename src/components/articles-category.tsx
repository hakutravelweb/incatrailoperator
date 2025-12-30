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
      <div className='shadow-deep flex flex-col gap-4 rounded-xl bg-white p-4 md:sticky md:top-2'>
        <strong className='text-lg leading-6'>{t('categories')}</strong>
        <div className='flex flex-col gap-2'>
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
                className={cn(
                  'bg-anti-flash-white hover:bg-observatory rounded-lg p-2 transition-colors duration-100 hover:text-white',
                  {
                    'bg-observatory text-white': active,
                  },
                )}
              >
                <span className='text-base leading-5 font-medium'>
                  {category.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
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
