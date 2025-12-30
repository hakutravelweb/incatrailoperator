'use client'
import { useState, ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Icons } from '@/icons/icon'
import { HomeView } from '@/interfaces/home'
import { useHomesPagination } from '@/hooks/use-homes-pagination'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { HomeItem } from './home-item'
import { HomeCreate } from './home-create'
import { HomeUpdate } from './home-update'

export function Homes() {
  const t = useTranslations('Dashboard')
  const homes = useHomesPagination()
  const [homeId, setHomeId] = useState<string>('')
  const [homeView, setHomeView] = useState<HomeView>('HOMES')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value
    homes.onSearch(text)
  }

  const handleChangeView = (view: HomeView) => (id?: string) => {
    if (id) {
      setHomeId(id)
    }
    setHomeView(view)
  }

  if (homeView === 'EDIT') {
    return (
      <HomeUpdate
        homeId={homeId}
        onClose={handleChangeView('HOMES')}
        onRefresh={homes.onRefresh}
      />
    )
  }

  if (homeView === 'CREATE') {
    return (
      <HomeCreate
        onClose={handleChangeView('HOMES')}
        onRefresh={homes.onRefresh}
      />
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row'>
        <div className='divide-chinese-white border-chinese-white flex w-75 divide-x-2 rounded-sm border-2 focus-within:divide-black focus-within:border-black'>
          <div className='p-2'>
            <Icons.Search className='size-5' />
          </div>
          <input
            type='text'
            className='text-dark-charcoal flex-1 p-2 text-sm leading-4.5 outline-hidden'
            value={homes.search}
            onChange={handleChange}
            placeholder={t('article.search-placeholder')}
          />
        </div>
        <Button
          variant='action'
          icon='Plus'
          onClick={handleChangeView('CREATE')}
        >
          {t('article.add-label')}
        </Button>
      </div>
      <div className='divide-chinese-white divide-y'>
        {!homes.loading && homes.data.length === 0 && (
          <div className='flex justify-center py-4'>
            <span className='text-dav-ys-grey text-sm leading-4.5'>
              {t('article.empty-message')}
            </span>
          </div>
        )}
        {homes.loading && (
          <div className='flex justify-center py-2'>
            <Icons.Loading className='size-6' />
          </div>
        )}
        {homes.data.map((home) => {
          return (
            <HomeItem
              key={home.id}
              home={home}
              onEdit={handleChangeView('EDIT')}
              onRefresh={homes.onRefresh}
            />
          )
        })}
      </div>
      <Pagination
        limit={homes.limit}
        offset={homes.offset}
        total={homes.total}
        onOffset={homes.onOffset}
      />
    </div>
  )
}
