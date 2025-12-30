import { useEffect, useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { AttractionProduct } from '@/interfaces/attraction-product'
import { getPopularAttractionProducts } from '@/services/attraction-product'
import { toast } from '@/components/ui/toast'

export function usePopularAttractionProducts() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<Partial<AttractionProduct>[]>([])

  const fetchData = () => {
    startTransition(async () => {
      try {
        const attractionProducts = await getPopularAttractionProducts(locale)
        setData(attractionProducts)
      } catch {
        toast.error('ERROR INTERNAL SERVER')
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [locale])

  return {
    isPending,
    data,
  }
}
