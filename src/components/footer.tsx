'use client'
import { PropsWithChildren, HTMLAttributeAnchorTarget } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Link } from '@/i18n/routing'
import { useJourneys } from '@/hooks/use-journeys'
import { Section } from './section'

export function Footer() {
  const t = useTranslations('Footer')
  const journeys = useJourneys()

  return (
    <footer className='bg-abstract-navy flex flex-col gap-4 py-8'>
      <Section>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-[20%_1fr]'>
          <div className='flex flex-col items-center gap-4'>
            <img
              className='size-12 object-cover'
              src='/logos/logo.svg'
              alt='Inca Trail Operator'
              loading='lazy'
            />
            <span className='text-center text-sm leading-4.5 text-white'>
              {t('slogan')}
            </span>
          </div>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium text-white'>
                {t('contact.title')}
              </span>
              <div className='flex flex-col gap-2'>
                <InfoSection label={t('contact.company-name')}>
                  Inca Trail Operator E.I.R.L.
                </InfoSection>
                <InfoSection label={t('contact.ruc')}>20608224387</InfoSection>
                <InfoSection label={t('contact.address')}>
                  Av. Ayahuayco N.º 3 Cusco - Perú
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
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium text-white'>
                {t('support.title')}
              </span>
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
                <FooterLink
                  href={`${process.env.APP_URL}/doc/protegeme.jpg`}
                  target='_blank'
                >
                  {t('support.code-esnna')}
                </FooterLink>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium text-white'>
                {t('populars-journeys.title')}
              </span>
              {!journeys.loading && journeys.data.length === 0 && (
                <span className='text-sm leading-4.5 text-white'>
                  {t('populars-journeys.empty-message')}
                </span>
              )}
              {journeys.loading && (
                <div className='bg-bright-grey h-10 w-full animate-pulse' />
              )}
              <div className='flex flex-col gap-2'>
                {journeys.data.map((journey) => (
                  <FooterLink
                    key={journey.id}
                    href={`/journey/${journey.slug}`}
                  >
                    {journey.title}
                  </FooterLink>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium text-white'>
                {t('information.title')}
              </span>
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
          <span className='text-sm leading-4.5 text-white'>
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
      <span className='text-sm leading-6 font-medium text-white'>{label}</span>
      <span className='text-sm leading-6 text-white'>{children}</span>
    </div>
  )
}

interface FooterLinkProps {
  href: string
  target?: HTMLAttributeAnchorTarget
}

function FooterLink({
  href,
  target,
  children,
}: PropsWithChildren<FooterLinkProps>) {
  return (
    <Link
      href={href}
      target={target}
      className='text-sm leading-6 font-medium text-white underline'
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
    <Link href={href} target='_blank'>
      <Icon className='size-6 text-white' />
    </Link>
  )
}
