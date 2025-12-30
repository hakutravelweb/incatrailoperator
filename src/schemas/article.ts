import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  translateSchema,
  translateMultipleSchema,
  translateDefaultValues,
  translateMultipleDefaultValues,
} from './root'
import { locales } from '@/i18n/config'
import { isSlug } from '@/lib/utils'

const articleSchema = z
  .object({
    slug: translateSchema.superRefine((value, ctx) => {
      locales.forEach((locale) => {
        const isValid = isSlug(value[locale])
        if (!isValid) {
          ctx.addIssue({
            code: 'custom',
            message: '',
            path: [locale],
          })
        }
      })
    }),
    photo: z.file().nullable(),
    previewPhoto: z.string(),
    title: translateSchema,
    description: translateSchema,
    labels: translateMultipleSchema,
    content: translateSchema,
    authorId: z.string(),
    categoryId: z.string().min(1),
  })
  .superRefine((value, ctx) => {
    if (!value.photo && !value.previewPhoto) {
      ctx.addIssue({
        code: 'custom',
        message: '',
        path: ['photo'],
      })
    }
  })

export type ArticleSchema = z.infer<typeof articleSchema>

export const articleResolver = zodResolver(articleSchema)

export const articleDefaultValues: ArticleSchema = {
  slug: translateDefaultValues,
  photo: null,
  previewPhoto: '',
  title: translateDefaultValues,
  description: translateDefaultValues,
  labels: translateMultipleDefaultValues,
  content: translateDefaultValues,
  authorId: '',
  categoryId: '',
}

const linkSchema = z.object({
  url: z.url(),
})

export type LinkSchema = z.infer<typeof linkSchema>

export const linkResolver = zodResolver(linkSchema)

export const linkDefaultValues: LinkSchema = {
  url: '',
}
