import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export type SignInSchema = z.infer<typeof signInSchema>

export const signInResolver = zodResolver(signInSchema)

export const signInDefaultValues: SignInSchema = {
  email: '',
  password: '',
}
