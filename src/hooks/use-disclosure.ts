import { useState } from 'react'

export interface Disclosure {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

export function useDisclosure(): Disclosure {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return {
    isOpen,
    onOpen: handleOpen,
    onClose: handleClose,
    onToggle: handleToggle,
  }
}
