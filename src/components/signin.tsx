'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { redirect } from '@/i18n/routing'
import {
  SignInSchema,
  signInResolver,
  signInDefaultValues,
} from '@/schemas/user'
import { signIn } from '@/services/user'
import { toast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SignIn() {
  const locale = useLocale()
  const t = useTranslations('AuthSignIn')
  const form = useForm<SignInSchema>({
    mode: 'all',
    resolver: signInResolver,
    defaultValues: signInDefaultValues,
  })

  const handleSignin = async (data: SignInSchema) => {
    let isSuccess = false
    try {
      const user = await signIn(data)
      toast.success(
        t('weelcome', {
          name: user.name,
        }),
      )
      isSuccess = true
    } catch (error) {
      toast.error(t('error-session'))
    }
    if (isSuccess) {
      redirect({
        href: '/dashboard',
        locale,
      })
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <Controller
        control={form.control}
        name='email'
        render={({ field, fieldState }) => (
          <Input
            label={t('labels.email')}
            value={field.value}
            onChange={field.onChange}
            placeholder='user@example.com'
            invalid={fieldState.invalid}
          />
        )}
      />
      <Controller
        control={form.control}
        name='password'
        render={({ field, fieldState }) => (
          <Input
            label={t('labels.password')}
            type='password'
            value={field.value}
            onChange={field.onChange}
            placeholder='******'
            invalid={fieldState.invalid}
          />
        )}
      />
      <Button
        variant='primary'
        disabled={form.formState.isSubmitting}
        onClick={form.handleSubmit(handleSignin)}
      >
        {t('sign-in')}
      </Button>
    </div>
  )
}
