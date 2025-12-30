import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Destination } from '@/interfaces/attraction-product'
import { getDestinations } from '@/services/destination'
import { toast } from '@/components/ui/toast'

export function useDestinations() {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Destination[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const destinations = await getDestinations(locale)
      setData(destinations)
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
