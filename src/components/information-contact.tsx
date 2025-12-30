import { PropsWithChildren } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'

export function InformationContact() {
  const t = useTranslations('ContactUs')

  return (
    <div className='flex flex-col gap-4'>
      <Information icon='Whatsapp' label='Whatsapp'>
        +51 984 259 412
      </Information>
      <Information icon='Email' label={t('information.email-label')}>
        info@incatrailoperator.com
      </Information>
      <Information icon='Location' label={t('information.office-label')}>
        Av. Ayahuayco N-3, Cusco, Perú
      </Information>
      <embed
        className='bg-inferno/10 h-50 rounded-xl'
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d877.1011797588441!2d-71.98817253080612!3d-13.514255409180706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd74a4f3e3f13%3A0x159c9fc691efe075!2sInca%20Trail%20Operator!5e0!3m2!1ses-419!2spe!4v1767079156491!5m2!1ses-419!2spe'
      />
      <div className='bg-inferno/10 border-l-inferno flex flex-col gap-4 rounded-xl border-l-2 p-4'>
        <strong className='text-base leading-5 font-medium'>
          {t('information.company-title')}
        </strong>
        <div className='flex flex-col gap-2'>
          <InformationCompany label={t('information.company-name-label')}>
            Inca Trail Operator E.I.R.L
          </InformationCompany>
          <InformationCompany label='RUC:'>20615005097</InformationCompany>
          <InformationCompany label={t('information.comercial-name-label')}>
            Inca Trail Operator
          </InformationCompany>
        </div>
      </div>
    </div>
  )
}

interface InformationProps {
  icon: keyof typeof Icons
  label: string
}

function Information({
  icon,
  label,
  children,
}: PropsWithChildren<InformationProps>) {
  const Icon = Icons[icon]

  return (
    <div className='flex items-center gap-2'>
      <div className='bg-anti-flash-white flex size-8 items-center justify-center rounded-full'>
        <Icon className='text-inferno size-4' />
      </div>
      <div className='flex flex-col gap-1'>
        <span className='text-base leading-5 font-medium'>{label}</span>
        <span className='text-dark-charcoal text-sm leading-4.5'>
          {children}
        </span>
      </div>
    </div>
  )
}

interface InformationCompanyProps {
  label: string
}

function InformationCompany({
  label,
  children,
}: PropsWithChildren<InformationCompanyProps>) {
  return (
    <div className='flex items-center gap-4'>
      <span className='text-inferno text-sm leading-4.5'>{label}</span>
      <span className='text-dav-ys-grey text-sm leading-4.5'>{children}</span>
    </div>
  )
}
