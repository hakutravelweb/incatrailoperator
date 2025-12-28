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
    <Dropdown position='top-right'>
      <Dropdown.Trigger>
        <div className='flex items-center gap-1'>
          <div className='flex flex-col gap-px'>
            <strong className='text-base leading-6'>{user.name}</strong>
            <span className='text-dark-charcoal text-sm leading-4.5'>
              {user.email}
            </span>
          </div>
          <Icons.Down className='size-5' />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Option onClick={signOut}>{t('log-out')}</Dropdown.Option>
      </Dropdown.Content>
    </Dropdown>
  )
}
