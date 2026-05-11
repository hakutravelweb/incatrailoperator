import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Journey, PriceRange } from '@/interfaces/journey'
import { getJourneysDestination } from '@/services/journey'
import { useDebounce } from './use-debounce'
import { toast } from '@/components/ui/toast'

export function useJourneysDestination(destinationId: string) {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Journey[]>([])
  const [search, setSearch] = useState<string>('')
  const [categoriesId, setCategoriesId] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: 2000,
  })
  const [ratings, setRatings] = useState<number[]>([])
  const debouncedSearch = useDebounce(search, 600)

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleCategory = (value: string) => {
    if (categoriesId.includes(value)) {
      const index = categoriesId.indexOf(value)
      categoriesId.splice(index, 1)
    } else {
      categoriesId.push(value)
    }
    setCategoriesId([...categoriesId])
  }

  const handlePriceRange = (value: PriceRange) => {
    setPriceRange(value)
  }

  const handleRating = (value: number) => {
    if (ratings.includes(value)) {
      const index = ratings.indexOf(value)
      ratings.splice(index, 1)
    } else {
      ratings.push(value)
    }
    setRatings([...ratings])
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const journeys = await getJourneysDestination({
        locale,
        destinationId,
        search,
        categoriesId,
        priceRange,
        ratings,
      })
      setData(journeys)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [
    locale,
    destinationId,
    debouncedSearch,
    categoriesId,
    priceRange,
    ratings,
  ])

  return {
    loading,
    data,
    search,
    categoriesId,
    priceRange,
    ratings,
    onSearch: handleSearch,
    onCategory: handleCategory,
    onPriceRange: handlePriceRange,
    onRating: handleRating,
  }
}
