'use client'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { User } from '@/generated/prisma/client'
import { signOut } from '@/services/user'
import { Dropdown } from '@/components/ui/dropdown'

interface Props {
  user: User
}

export function Profile({ user }: Props) {
  const t = useTranslations('Dashboard')

  return (
    <div className='flex items-center gap-2'>
      <div className='flex flex-col'>
        <span className='text-base leading-5.5 font-medium'>{user.name}</span>
        <span className='text-nevada text-sm leading-4.5'>{user.email}</span>
      </div>
      <Dropdown>
        <Dropdown.Trigger>
          <Icons.Down className='size-5' />
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Option danger onClick={signOut}>
            {t('log-out')}
          </Dropdown.Option>
        </Dropdown.Content>
      </Dropdown>
    </div>
  )
}
