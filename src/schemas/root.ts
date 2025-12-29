import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

export const filtersAttractionProductsSchema = z.object({
  search: z.string(),
  category: z.string(),
})

export type FiltersAttractionProductsSchema = z.infer<
  typeof filtersAttractionProductsSchema
>

export const filtersAttractionProductsResolver = zodResolver(
  filtersAttractionProductsSchema,
)

export const filtersAttractionProductsDefaultValues: FiltersAttractionProductsSchema =
  {
    search: '',
    category: '',
  }
