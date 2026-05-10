interface Props {
  content: string
}

export function ParseHtml({ content }: Props) {
  return (
    <div
      className='text-dark-charcoal [&_a]:text-inferno [&_hr]:border-t-chinese-white [&_ul_li,&_ol_li]:marker:text-inferno text-base leading-6 [&_:is(h3)]:mb-3 [&_:is(h3,strong)]:font-medium [&_:is(h3,strong)]:text-black [&_a]:underline [&_h3]:text-xl [&_h3]:leading-5 [&_hr]:my-4 [&_ol]:list-decimal [&_p:not(:last-child)]:mb-4 [&_ul]:list-disc [&_ul_li,&_ol_li]:ml-6 [&_ul_li:not(:first-child),&_ol_li:not(:first-child)]:mt-2 [&_ul:not(:last-child),&_ol:not(:last-child)]:mb-4'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
