import { useEffect, useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { Destination } from '@/interfaces/attraction-product'
import { getDestinationsPagination } from '@/services/destination'
import { useDebounce } from './use-debounce'
import { toast } from '@/components/ui/toast'

export function useDestinationsPagination() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<Destination[]>([])
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

  const fetchData = () => {
    startTransition(async () => {
      try {
        const destinations = await getDestinationsPagination(
          locale,
          debouncedSearch,
          limit,
          offset,
        )
        setData(destinations.data)
        setTotal(destinations.total)
      } catch {
        toast.error('ERROR INTERNAL SERVER')
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [locale, debouncedSearch, limit, offset])

  return {
    isPending,
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
