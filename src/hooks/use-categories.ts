import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Category } from '@/interfaces/attraction-product'
import { getCategories } from '@/services/category'
import { toast } from '@/components/ui/toast'

export function useCategories() {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Category[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const categories = await getCategories(locale)
      setData(categories)
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
