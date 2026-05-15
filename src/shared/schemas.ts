import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export const translationSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
})

export const translationMultipleSchema = z.object({
  es: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
})

export type TranslationSchema = z.infer<typeof translationSchema>

export type TranslationMultipleSchema = z.infer<
  typeof translationMultipleSchema
>

export const translationDefaultValues: TranslationSchema = {
  es: '',
  en: '',
}

export const translationMultipleDefaultValues: TranslationMultipleSchema = {
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
