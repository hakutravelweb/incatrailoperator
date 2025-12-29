import { useEffect, useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { Destination } from '@/interfaces/attraction-product'
import { getDestinations } from '@/services/destination'
import { toast } from '@/components/ui/toast'

export function useDestinations() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<Destination[]>([])

  const fetchData = () => {
    startTransition(async () => {
      try {
        const destinations = await getDestinations(locale)
        setData(destinations)
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
