'use client'
import { useTranslations } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import {
  ContactUsSchema,
  contactUsResolver,
  contactUsDefaultValues,
} from '@/schemas/contact-us'
import { useAttractionProducts } from '@/hooks/use-attraction-products'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Select } from './ui/select'

export function Contact() {
  const t = useTranslations('ContactUs')
  const form = useForm<ContactUsSchema>({
    resolver: contactUsResolver,
    defaultValues: contactUsDefaultValues,
  })
  const attractionProducts = useAttractionProducts()

  const handleContact = (data: ContactUsSchema) => {
    const whatsappMessage = t('contact.message', {
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      attractionProduct: data.attractionProduct,
      message: data.message,
    })

    const whatsappUrl = `https://wa.me/+51984259412?text=${whatsappMessage}`

    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className='flex flex-col gap-4'>
      <Controller
        control={form.control}
        name='fullname'
        render={({ field, fieldState }) => (
          <Input
            ref={field.ref}
            label={t('contact.fullname-label')}
            value={field.value}
            onChange={field.onChange}
            invalid={fieldState.invalid}
          />
        )}
      />
      <Controller
        control={form.control}
        name='email'
        render={({ field, fieldState }) => (
          <Input
            ref={field.ref}
            label={t('contact.email-label')}
            value={field.value}
            onChange={field.onChange}
            invalid={fieldState.invalid}
          />
        )}
      />
      <Controller
        control={form.control}
        name='phone'
        render={({ field, fieldState }) => (
          <Input
            ref={field.ref}
            label={t('contact.phone-label')}
            value={field.value}
            onChange={field.onChange}
            invalid={fieldState.invalid}
          />
        )}
      />
      <Controller
        control={form.control}
        name='attractionProduct'
        render={({ field, fieldState }) => (
          <Select
            ref={field.ref}
            label={t('contact.attraction-product-label')}
            value={field.value}
            onChange={field.onChange}
            placeholder={t('contact.attraction-product-placeholder')}
            invalid={fieldState.invalid}
          >
            {attractionProducts.data.map((attractionProduct) => {
              return (
                <Select.Option
                  key={attractionProduct.id}
                  value={attractionProduct.title}
                >
                  {attractionProduct.title}
                </Select.Option>
              )
            })}
          </Select>
        )}
      />
      <Controller
        control={form.control}
        name='message'
        render={({ field, fieldState }) => (
          <Textarea
            ref={field.ref}
            label={t('contact.message-label')}
            value={field.value}
            onChange={field.onChange}
            invalid={fieldState.invalid}
          />
        )}
      />
      <Button
        disabled={form.formState.isSubmitting}
        onClick={form.handleSubmit(handleContact)}
      >
        {t('contact.send-label')}
      </Button>
    </div>
  )
}
