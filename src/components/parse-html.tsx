interface Props {
  content: string
}

export function ParseHtml({ content }: Props) {
  return (
    <div
      className='text-dark-charcoal prose prose-strong:text-black prose-strong:font-medium prose-ul:pl-4 prose-li:p-0 prose-li:m-0 prose-ul:prose-p:m-0 prose-li:mb-1 prose-li:marker:text-observatory prose-a:text-observatory prose-a:hover:text-strong-dark-green prose-blockquote:border-s-observatory max-w-none text-base leading-5'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
