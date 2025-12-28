import 'dotenv/config'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

async function main() {
  const password = await bcrypt.hash(ADMIN_PASSWORD!, 10)
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL! },
    update: {},
    create: {
      name: ADMIN_NAME!,
      email: ADMIN_EMAIL!,
      password,
    },
  })
  console.log(`Administrator user created: ${admin.email}`)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
