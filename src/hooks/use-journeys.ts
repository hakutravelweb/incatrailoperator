import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Journey } from '@/interfaces/journey'
import { getJourneys } from '@/services/journey'
import { useDebounce } from './use-debounce'
import { toast } from '@/components/ui/toast'

export function useJourneys() {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Journey[]>([])
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const debouncedSearch = useDebounce(search, 600)

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleCategory = (value: string) => {
    setCategory(value)
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const journeys = await getJourneys(locale, debouncedSearch, category)
      setData(journeys)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [locale, debouncedSearch, category])

  return {
    loading,
    data,
    onSearch: handleSearch,
    onCategory: handleCategory,
  }
}
