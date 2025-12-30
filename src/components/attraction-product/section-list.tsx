interface Props {
  title: string
  list: string[]
}

export function SectionList({ title, list }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <strong className='text-base leading-5.25 font-bold'>{title}</strong>
      <div className='flex flex-col gap-1'>
        {list.map((item, index) => {
          return (
            <div key={index} className='flex items-center gap-2'>
              <span className='text-dark-charcoal text-base leading-6'>•</span>
              <span className='text-dark-charcoal text-base leading-6'>
                {item}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
