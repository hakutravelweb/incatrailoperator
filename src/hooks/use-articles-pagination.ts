import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Article } from '@/interfaces/article'
import { getArticlesPagination } from '@/services/article'
import { useDebounce } from './use-debounce'
import { toast } from '@/components/ui/toast'

export function useArticlesPagination() {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Article[]>([])
  const [limit, setLimit] = useState<number>(10)
  const [offset, setOffset] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounce(search, 600)

  const handleSearch = (value: string) => {
    setSearch(value)
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
      const articles = await getArticlesPagination(
        locale,
        debouncedSearch,
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
  }, [locale, debouncedSearch, limit, offset])

  return {
    loading,
    data,
    search,
    limit,
    offset,
    total,
    onSearch: handleSearch,
    onLimit: handleLimit,
    onOffset: handleOffset,
    onRefresh: fetchData,
  }
}
