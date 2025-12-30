import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const contactUsSchema = z.object({
  fullname: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  attractionProduct: z.string().min(1),
  message: z.string().min(1),
})

export type ContactUsSchema = z.infer<typeof contactUsSchema>

export const contactUsResolver = zodResolver(contactUsSchema)

export const contactUsDefaultValues: ContactUsSchema = {
  fullname: '',
  email: '',
  phone: '',
  attractionProduct: '',
  message: '',
}
