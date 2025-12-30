import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Article } from '@/interfaces/article'
import { getArticlesCategoryPagination } from '@/services/article'
import { toast } from '@/components/ui/toast'

export function useArticlesCategoryPagination() {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Article[]>([])
  const [limit, setLimit] = useState<number>(10)
  const [offset, setOffset] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [categoryId, setCategoryId] = useState<string>('')

  const handleCategory = (value: string) => {
    setCategoryId(value)
  }

  const handleLimit = (value: number) => {
    setLimit(value)
  }

  const handleOffset = (value: number) => {
    setOffset(value)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const articles = await getArticlesCategoryPagination(
        locale,
        categoryId,
        limit,
        offset,
      )
      setData(articles.data)
      setTotal(articles.total)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [locale, categoryId, limit, offset])

  return {
    loading,
    data,
    categoryId,
    limit,
    offset,
    total,
    onCategory: handleCategory,
    onLimit: handleLimit,
    onOffset: handleOffset,
    onRefresh: fetchData,
  }
}
