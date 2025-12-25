import { useEffect, useState } from 'react'

export function useMediaQuery(
  type: 'min-w' | 'max-w' = 'min-w',
  value: number,
): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const listener = (entries: ResizeObserverEntry[]) => {
      const { width } = entries[0].contentRect
      if (type === 'min-w') {
        return setMatches(width >= value)
      }
      setMatches(width <= value)
    }

    const observer = new ResizeObserver(listener)
    observer.observe(document.body)

    return () => {
      observer.unobserve(document.body)
    }
  }, [type, value])

  return matches
}
