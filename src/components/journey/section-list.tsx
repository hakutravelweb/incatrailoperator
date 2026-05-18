import { Icons } from '@/icons/icon'

interface Props {
  variant?: 'includes' | 'not-included'
  title: string
  list: string[]
}

export function SectionList({ variant, title, list }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-xl leading-6 font-bold'>{title}</h2>
      <div className='flex flex-col gap-1'>
        {list.map((item, index) => {
          return (
            <div key={index} className='flex items-center gap-2'>
              {variant === 'includes' ? (
                <Icons.Check className='text-dark-jade size-4' />
              ) : variant === 'not-included' ? (
                <Icons.Close className='text-cayenne-red size-4' />
              ) : (
                <span className='text-base leading-5.5'>•</span>
              )}
              <span className='flex-1 text-base leading-5.5'>{item}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
