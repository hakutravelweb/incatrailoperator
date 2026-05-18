interface Props {
  content: string
}

export function ParseHtml({ content }: Props) {
  return (
    <div
      className='[&_:is(h3,strong)]:text-abstract-navy [&_hr]:border-t-faded-white [&_ul_li,&_ol_li]:marker:text-abstract-navy [&_a]:underline-premium text-base leading-5.5 [&_:is(h3)]:mb-2 [&_:is(h3,strong)]:font-medium [&_a]:font-medium [&_h3]:text-xl [&_h3]:leading-6 [&_h3]:font-bold [&_hr]:my-4 [&_ol]:list-decimal [&_p:not(:last-child)]:mb-4 [&_ul]:list-disc [&_ul_li,&_ol_li]:ml-4 [&_ul:not(:last-child),&_ol:not(:last-child)]:mb-4'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
