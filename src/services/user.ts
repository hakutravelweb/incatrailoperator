'use server'
import { cache } from 'react'
import { getLocale } from 'next-intl/server'
import bcrypt from 'bcrypt'
import { redirect } from '@/i18n/routing'
import { prisma } from '@/lib/prisma'
import { createSession, getSession, deleteSession } from '@/lib/session'
import { signInSchema, SignInSchema } from '@/schemas/user'

export async function signIn(input: SignInSchema) {
  const data = await signInSchema.parseAsync(input)

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: data.email,
    },
  })

  const validPassword = await bcrypt.compare(data.password, user.password)
  if (!validPassword) throw new Error('INVALID CREDENTIALS')

  await createSession(user.id)

  return user
}

export const auth = cache(async () => {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.userId,
    },
  })

  return user
})

export async function signOut() {
  const locale = await getLocale()
  await deleteSession()
  redirect({
    href: '/auth/signin',
    locale,
  })
}
