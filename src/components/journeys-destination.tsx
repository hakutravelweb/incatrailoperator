'use client'
import { ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { Link } from '@/i18n/routing'
import { Destination } from '@/interfaces/journey'
import { useCategories } from '@/hooks/use-categories'
import { useJourneysDestination } from '@/hooks/use-journeys-destination'
import { Section } from './section'
import { Checkbox, CheckboxNumber } from './ui/checkbox'
import { Rating } from './journey/rating'
import { JourneyVerticalCard } from './journey-vertical-card'
import { PriceRangeSlider } from './ui/price-range-slider'

interface Props {
  destination: Destination
}

export function JourneysDestination({ destination }: Props) {
  const t = useTranslations('Destination')
  const categories = useCategories()
  const ratings = Array.from({ length: 5 }, (_, index) => index + 1)
  const journeys = useJourneysDestination(destination.id)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    journeys.onSearch(text)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='bg-dark-jade py-8'>
        <Section>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center gap-1'>
              <Link
                href='/'
                className='hover:underline-premium text-base leading-5.5 text-white'
              >
                {t('country')}
              </Link>
              <Icons.Right className='size-4 text-white' />
              <span className='text-base leading-5.5 text-white'>
                {destination.department}
              </span>
            </div>
            <div className='flex flex-col gap-4'>
              <span className='text-2xl leading-7.25 font-bold text-white md:text-[28px] md:leading-8.5'>
                {t('discover', {
                  title: destination.title,
                })}
              </span>
              <span className='text-base leading-5.5 text-white'>
                {destination.about}
              </span>
              <div className='border-faded-white shadow-main-small flex h-11 w-75 items-center gap-2 rounded-full border bg-white px-4 py-2.25'>
                <Icons.Search className='size-5' />
                <input
                  type='text'
                  className='placeholder:text-pewter-metallic flex-1 text-sm leading-4.5 outline-hidden'
                  value={journeys.search}
                  onChange={handleChange}
                  placeholder={t('search-placeholder')}
                />
              </div>
            </div>
          </div>
        </Section>
      </div>
      <Section>
        <div className='grid grid-cols-1 items-start gap-8 py-8 md:grid-cols-[30%_1fr]'>
          <div className='border-faded-white flex flex-col gap-4 rounded-2xl border bg-white p-4 md:sticky md:top-4'>
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium'>
                {t('categories')}
              </span>
              <div className='flex flex-col gap-1'>
                {!categories.loading && categories.data.length === 0 && (
                  <span className='text-nevada text-sm leading-4.5'>
                    {t('categories-empty')}
                  </span>
                )}
                {categories.loading && (
                  <div className='flex justify-center py-2'>
                    <Icons.Loading className='size-6' />
                  </div>
                )}
                {categories.data.map((category) => {
                  const active = journeys.categoriesId.includes(category.id)

                  return (
                    <Checkbox
                      key={category.id}
                      active={active}
                      value={category.id}
                      onChange={journeys.onCategory}
                    >
                      {category.title}
                    </Checkbox>
                  )
                })}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium'>
                {t('price')}
              </span>
              <PriceRangeSlider
                min={0}
                max={2000}
                value={journeys.priceRange}
                onChange={journeys.onPriceRange}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <span className='text-base leading-5.5 font-medium'>
                {t('qualification')}
              </span>
              <div className='flex flex-col gap-2'>
                {ratings.map((rating) => {
                  const active = journeys.ratings.includes(rating)

                  return (
                    <CheckboxNumber
                      key={rating}
                      active={active}
                      value={rating}
                      onChange={journeys.onRating}
                    >
                      <Rating rating={rating} />
                    </CheckboxNumber>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {!journeys.loading && journeys.data.length === 0 && (
              <div className='flex justify-center py-4'>
                <span className='text-nevada text-sm leading-4.5'>
                  {t('empty-message')}
                </span>
              </div>
            )}
            {journeys.loading && (
              <div className='flex justify-center py-2'>
                <Icons.Loading className='size-6' />
              </div>
            )}
            {journeys.data.map((journey) => {
              return <JourneyVerticalCard key={journey.id} journey={journey} />
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}
