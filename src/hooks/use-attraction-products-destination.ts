import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { AttractionProduct, RangePrice } from '@/interfaces/attraction-product'
import { getAttractionProductsDestination } from '@/services/attraction-product'
import { useDebounce } from './use-debounce'
import { toast } from '@/components/ui/toast'

export function useAttractionProductsDestination(destinationId: string) {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<AttractionProduct[]>([])
  const [search, setSearch] = useState<string>('')
  const [categoriesId, setCategoriesId] = useState<string[]>([])
  const [rangePrice, setRangePrice] = useState<RangePrice>({
    from: 0,
    to: 2000,
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

  const handleRangePrice = (value: RangePrice) => {
    setRangePrice(value)
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
      const attractionProducts = await getAttractionProductsDestination({
        locale,
        destinationId,
        search,
        categoriesId,
        rangePrice,
        ratings,
      })
      setData(attractionProducts)
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
    rangePrice,
    ratings,
  ])

  return {
    loading,
    data,
    search,
    categoriesId,
    rangePrice,
    ratings,
    onSearch: handleSearch,
    onCategory: handleCategory,
    onRangePrice: handleRangePrice,
    onRating: handleRating,
  }
}
