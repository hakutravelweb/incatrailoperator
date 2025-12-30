'use client'
import { PropsWithChildren } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Link } from '@/i18n/routing'
import { useAttractionProducts } from '@/hooks/use-attraction-products'
import { Section } from './section'

export function Footer() {
  const t = useTranslations('Footer')
  const attractionProducts = useAttractionProducts()

  return (
    <footer className='bg-anti-flash-white flex flex-col gap-6 py-10'>
      <Section>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-[20%_1fr]'>
          <div className='flex flex-col items-center gap-4'>
            <img
              className='size-12 object-cover'
              src='/logos/logo.svg'
              alt='Inca Trail Operator'
              loading='lazy'
            />
            <span className='text-dark-charcoal text-center text-sm leading-4.5'>
              {t('slogan')}
            </span>
          </div>
          <div className='grid grid-cols-2 gap-6 lg:grid-cols-4'>
            <div className='flex flex-col gap-4'>
              <strong className='text-base leading-5'>
                {t('contact.title')}
              </strong>
              <div className='flex flex-col gap-2'>
                <InfoSection label={t('contact.company-name')}>
                  Inca Trail Operator E.I.R.L.
                </InfoSection>
                <InfoSection label={t('contact.ruc')}>20615005097</InfoSection>
                <InfoSection label={t('contact.address')}>
                  Av. Ayahuayco N-3, Cusco, Perú
                </InfoSection>
                <InfoSection label={t('contact.email')}>
                  info@incatrailoperator.com
                </InfoSection>
                <InfoSection label={t('contact.phone')}>
                  +51 984 259 412
                </InfoSection>
                <InfoSection label={t('contact.schedule')}>
                  8:00 AM - 8:00 PM
                </InfoSection>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <strong className='text-base leading-5'>
                {t('support.title')}
              </strong>
              <div className='flex flex-col gap-2'>
                <FooterLink href='/contact-us'>
                  {t('support.contact-us')}
                </FooterLink>
                <FooterLink href='/terms-and-conditions'>
                  {t('support.terms-and-conditions')}
                </FooterLink>
                <FooterLink href='/privacy-policy'>
                  {t('support.privacy-policy')}
                </FooterLink>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <strong className='text-base leading-5'>
                {t('populars-attractions.title')}
              </strong>
              {!attractionProducts.loading &&
                attractionProducts.data.length === 0 && (
                  <span className='text-dav-ys-grey text-sm leading-4.5'>
                    {t('populars-attractions.empty-message')}
                  </span>
                )}
              {attractionProducts.loading && (
                <div className='bg-chinese-white h-10 w-full animate-pulse' />
              )}
              <div className='flex flex-col gap-2'>
                {attractionProducts.data.map((attractionProduct) => (
                  <FooterLink
                    key={attractionProduct.id}
                    href={`/attraction-product/${attractionProduct.slug}`}
                  >
                    {attractionProduct.title}
                  </FooterLink>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <strong className='text-base leading-5'>
                {t('information.title')}
              </strong>
              <div className='flex flex-col gap-2'>
                <FooterLink href='/about-us'>
                  {t('information.about-us')}
                </FooterLink>
                <FooterLink href='/articles'>
                  {t('information.articles')}
                </FooterLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className='grid grid-cols-1 place-items-center gap-4 md:grid-cols-2'>
          <span className='text-dav-ys-grey block text-sm leading-4.5'>
            {t('author', {
              year: new Date().getFullYear(),
            })}
          </span>
          <div className='flex gap-2'>
            <SocialIconLink
              href='https://www.facebook.com/incatrailoperator'
              icon='Facebook'
            />
            <SocialIconLink
              href='https://www.instagram.com/incatrailoperator'
              icon='Instagram'
            />
            <SocialIconLink
              href='https://www.twitter.com/incatrailoperator'
              icon='Twitter'
            />
            <SocialIconLink
              href='https://www.youtube.com/incatrailoperator'
              icon='Youtube'
            />
          </div>
        </div>
      </Section>
    </footer>
  )
}

interface InfoSectionProps {
  label: string
}
function InfoSection({ label, children }: PropsWithChildren<InfoSectionProps>) {
  return (
    <div className='space-x-1'>
      <span className='text-dark-charcoal text-sm leading-4.5 font-medium'>
        {label}
      </span>
      <span className='text-dav-ys-grey text-sm leading-4.5'>{children}</span>
    </div>
  )
}

interface FooterLinkProps {
  href: string
}

function FooterLink({ href, children }: PropsWithChildren<FooterLinkProps>) {
  return (
    <Link
      href={href}
      className='text-dav-ys-grey text-sm leading-4.5 hover:underline'
    >
      {children}
    </Link>
  )
}

interface SocialIconLinkProps {
  href: string
  icon: keyof Pick<
    typeof Icons,
    'Facebook' | 'Instagram' | 'Twitter' | 'Youtube'
  >
}

function SocialIconLink({ href, icon }: SocialIconLinkProps) {
  const Icon = Icons[icon]

  return (
    <Link
      href={href}
      className='bg-chinese-white flex size-8 items-center justify-center rounded-full'
      target='_blank'
    >
      <Icon className='size-5' />
    </Link>
  )
}
