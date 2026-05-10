import { Locale, DurationType, Variant } from '@/generated/prisma/enums'

export const SESSION_COOKIE = 'INCA_TRAIL_OPERATOR_SESSION'

export const PROTECTED_ROUTES = ['dashboard']

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const variants = Object.values(Variant)

export const durationTypes = Object.values(DurationType)

export const guidedLanguages = Object.values(Locale)
