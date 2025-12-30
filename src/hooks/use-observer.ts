import { useEffect } from 'react'
import { ObserverSelector } from '@/interfaces/root'

export function useObserver(
  selector: ObserverSelector,
  onIntersect: (selectorId: string) => void,
) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const selectorId = entry.target.getAttribute(selector)
          if (selectorId) {
            onIntersect(selectorId)
          }
        }
      })
    })

    const elementsNavigation = document.querySelectorAll(`[${selector}]`)
    elementsNavigation.forEach((elementNavigation) => {
      observer.observe(elementNavigation)
    })

    return () => {
      elementsNavigation.forEach((elementNavigation) => {
        observer.unobserve(elementNavigation)
      })
      observer.disconnect()
    }
  }, [selector, onIntersect])
}
