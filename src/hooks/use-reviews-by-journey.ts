import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Review } from '@/interfaces/review'
import { getReviewsByJourney } from '@/services/review'
import { toast } from '@/components/ui/toast'

export function useReviewsByJourney(journeyId: string) {
  const locale = useLocale()
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Review[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const reviews = await getReviewsByJourney(locale, journeyId)
      setData(reviews)
    } catch {
      toast.error('ERROR INTERNAL SERVER')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [locale, journeyId])

  return {
    loading,
    data,
  }
}
