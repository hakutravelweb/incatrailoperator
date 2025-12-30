import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const linkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
})

const navigationSchema = z.object({
  id: z.string(),
  title: z.string(),
})

const homeSchema = z
  .object({
    locale: z.string(),
    photo: z.file().nullable(),
    previewPhoto: z.string(),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    link: linkSchema,
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
  locale: '',
  photo: null,
  previewPhoto: '',
  title: '',
  subtitle: '',
  link: {
    href: '',
    label: '',
  },
  navigationTerms: [],
  termsAndConditions: '',
  navigationPrivacy: [],
  privacyPolicy: '',
}
