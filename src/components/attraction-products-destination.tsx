'use client'
import { ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Link } from '@/i18n/routing'
import { Destination } from '@/interfaces/attraction-product'
import { useCategories } from '@/hooks/use-categories'
import { useAttractionProductsDestination } from '@/hooks/use-attraction-products-destination'
import { Section } from './section'
import { Checkbox, CheckboxNumber } from './ui/checkbox'
import { Rating } from './attraction-product/rating'
import { RangeInputNumber } from './ui/range-input-number'
import { AttractionProductVerticalCard } from './attraction-product-vertical-card'

interface Props {
  destination: Destination
}

export function AttractionProductDestination({ destination }: Props) {
  const t = useTranslations('Destination')
  const categories = useCategories()
  const ratings = Array.from({ length: 5 }, (_, index) => index + 1)
  const attractionProducts = useAttractionProductsDestination(destination.id)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    attractionProducts.onSearch(text)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='bg-strong-dark-green py-10'>
        <Section>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-1'>
              <Link
                href='/'
                className='text-base leading-5 text-white hover:underline'
              >
                {t('country')}
              </Link>
              <Icons.Right className='size-4 text-white' />
              <span className='text-base leading-5 text-white'>
                {destination.department}
              </span>
            </div>
            <div className='flex flex-col gap-4'>
              <strong className='text-2xl leading-7.25 font-black text-white md:text-[28px] md:leading-8.5'>
                {t('discover', {
                  title: destination.title,
                })}
              </strong>
              <span className='text-base leading-6 text-white'>
                {destination.about}
              </span>
              <div className='border-blue-green flex max-w-100 items-center gap-2 rounded-lg border-2 bg-white px-2'>
                <Icons.Search className='size-5' />
                <input
                  type='text'
                  className='text-dark-charcoal placeholder:text-gray-x11 flex-1 py-2 text-base leading-5 outline-hidden'
                  value={attractionProducts.search}
                  onChange={handleChange}
                  placeholder={t('search-placeholder')}
                />
              </div>
            </div>
          </div>
        </Section>
      </div>
      <Section>
        <div className='grid grid-cols-1 items-start gap-6 py-10 md:grid-cols-[30%_1fr]'>
          <div className='shadow-deep flex flex-col gap-6 rounded-xl bg-white p-4 md:sticky md:top-4'>
            <div className='flex flex-col gap-4'>
              <strong className='text-lg leading-6'>{t('categories')}</strong>
              <div className='flex flex-col gap-1'>
                {categories.loading && (
                  <div className='flex justify-center py-2'>
                    <Icons.Loading className='size-6' />
                  </div>
                )}
                {categories.data.map((category) => {
                  const active = attractionProducts.categoriesId.includes(
                    category.id,
                  )

                  return (
                    <Checkbox
                      key={category.id}
                      active={active}
                      value={category.id}
                      onChange={attractionProducts.onCategory}
                    >
                      {category.title}
                    </Checkbox>
                  )
                })}
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <strong className='text-lg leading-6'>{t('price')}</strong>
              <RangeInputNumber
                prefix='$'
                value={attractionProducts.rangePrice}
                onChange={attractionProducts.onRangePrice}
              />
            </div>
            <div className='flex flex-col gap-4'>
              <strong className='text-lg leading-6'>
                {t('qualification')}
              </strong>
              <div className='flex flex-col gap-1'>
                {ratings.map((rating) => {
                  const active = attractionProducts.ratings.includes(rating)

                  return (
                    <CheckboxNumber
                      key={rating}
                      active={active}
                      value={rating}
                      onChange={attractionProducts.onRating}
                    >
                      <Rating rating={rating} />
                    </CheckboxNumber>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='shadow-deep flex flex-col gap-4 rounded-xl bg-white p-4'>
            {!attractionProducts.loading &&
              attractionProducts.data.length === 0 && (
                <div className='flex justify-center py-4'>
                  <span className='text-dav-ys-grey text-sm leading-4.5'>
                    {t('empty-message')}
                  </span>
                </div>
              )}
            {attractionProducts.loading && (
              <div className='flex justify-center py-2'>
                <Icons.Loading className='size-6' />
              </div>
            )}
            {attractionProducts.data.map((attractionProduct) => {
              return (
                <AttractionProductVerticalCard
                  key={attractionProduct.id}
                  attractionProduct={attractionProduct}
                />
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}
