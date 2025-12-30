import { useState } from 'react'

export interface Disclosure {
  isOpen: boolean
  isSlide: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

interface Props {
  animateSlide?: boolean
}

export function useDisclosure(
  props: Props = { animateSlide: false },
): Disclosure {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSlide, setIsSlide] = useState<boolean>(false)

  const handleOpen = () => {
    setIsOpen(true)
    if (props.animateSlide) {
      setTimeout(() => {
        setIsSlide(true)
      }, 250)
    }
  }

  const handleClose = () => {
    if (props.animateSlide) {
      setIsSlide(false)
      return setTimeout(() => {
        setIsOpen(false)
      }, 250)
    }
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return {
    isOpen,
    isSlide,
    onOpen: handleOpen,
    onClose: handleClose,
    onToggle: handleToggle,
  }
}
