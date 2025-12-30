import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { AttractionProduct } from '@/interfaces/attraction-product'
import { getPopularAttractionProducts } from '@/services/attraction-product'
import { toast } from '@/components/ui/toast'

export function usePopularAttractionProducts() {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Partial<AttractionProduct>[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const attractionProducts = await getPopularAttractionProducts(locale)
      setData(attractionProducts)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [locale])

  return {
    loading,
    data,
  }
}
