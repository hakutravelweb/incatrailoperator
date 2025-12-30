import { Icons } from '@/icons/icon'

interface Props {
  variant?: 'includes' | 'not-included'
  title: string
  list: string[]
}

export function SectionList({ variant, title, list }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <strong className='text-base leading-5.25 font-bold'>{title}</strong>
      <div className='flex flex-col gap-1'>
        {list.map((item, index) => {
          return (
            <div key={index} className='flex items-center gap-2'>
              {variant === 'includes' ? (
                <Icons.Check className='text-inferno size-5' />
              ) : variant === 'not-included' ? (
                <Icons.Close className='text-ue-red size-5' />
              ) : (
                <span className='text-dark-charcoal text-base leading-6'>
                  •
                </span>
              )}
              <span className='text-dark-charcoal flex-1 text-base leading-6'>
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
