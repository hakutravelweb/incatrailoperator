import { useEffect, useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { Category } from '@/interfaces/attraction-product'
import { getCategories } from '@/services/category'
import { toast } from '@/components/ui/toast'

export function useCategories() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<Category[]>([])

  const fetchData = () => {
    startTransition(async () => {
      try {
        const categories = await getCategories(locale)
        setData(categories)
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
