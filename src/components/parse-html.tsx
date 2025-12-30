interface Props {
  content: string
}

export function ParseHtml({ content }: Props) {
  return (
    <div
      className='text-dark-charcoal prose prose-strong:text-black prose-strong:font-medium prose-ul:pl-4 prose-li:p-0 prose-li:m-0 prose-ul:prose-p:m-0 prose-li:mb-1 prose-li:marker:text-blue-green prose-a:text-observatory max-w-none text-base leading-6'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
