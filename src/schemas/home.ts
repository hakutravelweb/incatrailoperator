import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Locale } from '@/generated/prisma/enums'

const resourceSchema = z.object({
  url: z.string().min(1),
  text: z.string().min(1),
})

const navigationSchema = z.object({
  id: z.string(),
  title: z.string(),
})

const homeSchema = z
  .object({
    locale: z.enum(Locale),
    photo: z.file().nullable(),
    previewPhoto: z.string(),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    resource: resourceSchema,
    navigationTerms: z.array(navigationSchema),
    termsAndConditions: z.string().min(1),
    navigationPrivacy: z.array(navigationSchema),
    privacyPolicy: z.string().min(1),
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

export type HomeSchema = z.infer<typeof homeSchema>

export const homeResolver = zodResolver(homeSchema)

export const homeDefaultValues: HomeSchema = {
  locale: 'es',
  photo: null,
  previewPhoto: '',
  title: '',
  subtitle: '',
  resource: {
    url: '',
    text: '',
  },
  navigationTerms: [],
  termsAndConditions: '',
  navigationPrivacy: [],
  privacyPolicy: '',
}
