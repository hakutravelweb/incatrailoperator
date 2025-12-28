import 'server-only'
import { cache } from 'react'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from './constants'

interface SessionPayload extends JWTPayload {
  userId: string
  expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey)
}

async function decrypt(session: string) {
  const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookie = await cookies()

  cookie.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export const getSession = cache(async () => {
  const cookie = await cookies()
  const session = cookie.get(SESSION_COOKIE)
  if (!session) return null
  const payload = await decrypt(session.value)
  return payload
})

export async function deleteSession() {
  const cookie = await cookies()
  cookie.delete(SESSION_COOKIE)
}
