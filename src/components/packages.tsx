import { getLocale, getTranslations } from 'next-intl/server'
import { getAttractionProductPackages } from '@/services/attraction-product'
import { AttractionProductPackageCard } from './attraction-product-package-card'

export async function Packages() {
  const locale = await getLocale()
  const t = await getTranslations('Packages')
  const attractionProducts = await getAttractionProductPackages(locale)

  return (
    <div className='flex flex-col items-center gap-6 py-10'>
      <div className='flex flex-col items-center gap-2'>
        <strong className='text-2xl leading-7.25'>{t('title')}</strong>
        <span className='text-dark-charcoal text-base leading-5'>
          {t('description')}
        </span>
      </div>
      {attractionProducts.length === 0 && (
        <div className='flex justify-center py-4'>
          <span className='text-dav-ys-grey text-sm leading-4.5'>
            {t('empty-message')}
          </span>
        </div>
      )}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {attractionProducts.map((attractionProduct) => {
          return (
            <AttractionProductPackageCard
              key={attractionProduct.id}
              attractionProduct={attractionProduct}
            />
          )
        })}
      </div>
    </div>
  )
}

export function PackagesSkeleton() {
  return <div className='bg-chinese-white my-10 h-50 w-full animate-pulse' />
}
