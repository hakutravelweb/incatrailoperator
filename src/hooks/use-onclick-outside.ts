import { RefObject, useEffect } from 'react'

interface Props<T> {
  ref: RefObject<T> | RefObject<T>[]
  handler: (event: MouseEvent | TouchEvent) => void
}

export function useOnClickOutside<T extends HTMLElement | null>({
  ref,
  handler,
}: Props<T>) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (Array.isArray(ref)) {
        const isInside = ref.some(
          (r) => r.current && r.current.contains(event.target as Node),
        )
        if (isInside) return
      } else {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return
        }
      }
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}