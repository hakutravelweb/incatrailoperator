import { useEffect, useState } from 'react'
import { Home } from '@/interfaces/home'
import { getHomesPagination } from '@/services/home'
import { useDebounce } from './use-debounce'
import { toast } from '@/components/ui/toast'

export function useHomesPagination() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Home[]>([])
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
      const homes = await getHomesPagination(debouncedSearch, limit, offset)
      setData(homes.data)
      setTotal(homes.total)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [debouncedSearch, limit, offset])

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
