import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export function verifyOpenedModals() {
  const dialogs = document.querySelectorAll('[role="dialog"]')
  if (dialogs.length === 0) {
    document.body.classList.remove('overflow-hidden', 'touch-none')
  }
}
