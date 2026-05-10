import { useEffect, useRef } from 'react'

export function useObserver(
  selector: string,
  onIntersect: (selectorId: string) => void,
) {
  const callbackRef = useRef(onIntersect)

  useEffect(() => {
    callbackRef.current = onIntersect
  }, [onIntersect])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const selectorId = entry.target.getAttribute(selector)
            if (selectorId) {
              callbackRef.current(selectorId)
            }
          }
        })
      },
      {
        rootMargin: '-25% 0px -70% 0px',
        threshold: [0, 0.1, 0.2],
      },
    )

    const elements = document.querySelectorAll(`[${selector}]`)
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [selector])
}
