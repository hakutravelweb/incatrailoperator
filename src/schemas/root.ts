import { z } from 'zod'

export const translateSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
})

export const translateMultipleSchema = z.object({
  es: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
})

export type TranslateSchema = z.infer<typeof translateSchema>

export type TranslateMultipleSchema = z.infer<typeof translateMultipleSchema>

export const translateDefaultValues: TranslateSchema = {
  es: '',
  en: '',
}

export const translateMultipleDefaultValues: TranslateMultipleSchema = {
  es: [],
  en: [],
}
