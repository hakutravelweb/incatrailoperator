'use client'
import { useCallback, useState, useEffect } from 'react'
import { RefCallBack } from 'react-hook-form'
import {
  getHierarchicalIndexes,
  TableOfContentData,
  TableOfContents,
} from '@tiptap/extension-table-of-contents'
import DragHandle from '@tiptap/extension-drag-handle-react'
import Placeholder from '@tiptap/extension-placeholder'
import { TextSelection } from '@tiptap/pm/state'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Navigation } from '@/interfaces/root'
import { CustomHeading } from './extensions/custom-heading'

interface Props {
  ref?: RefCallBack
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  translate?: boolean
  onNavigation?: (value: Navigation[]) => void
  enabledNavigation?: boolean
}

export function Editor({
  ref,
  label,
  value = '',
  onChange,
  placeholder,
  invalid,
  translate,
  onNavigation,
  enabledNavigation,
}: Props) {
  const [navigation, setNavigation] = useState<TableOfContentData>([])
  const [activeNavigation, setActiveNavigation] = useState<string>()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: {
          levels: [2, 3],
        },
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:text-sonic-silver before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none',
      }),
      CustomHeading,
      TableOfContents.configure({
        anchorTypes: ['customHeading'],
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setNavigation(content)
          if (onNavigation && enabledNavigation) {
            const navigation: Navigation[] = content.map((navigation) => ({
              id: navigation.id,
              title: navigation.textContent,
            }))
            onNavigation(navigation)
          }
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          'prose max-w-full min-h-25 border-chinese-white focus:border-black rounded-sm border-2 outline-hidden prose-headings:text-black prose-headings:font-bold text-base leading-4.75 prose-base p-4 prose-blockquote:border-s-chinese-white prose-hr:border-t-chinese-white [&_nav]:data-toc-id:w-fit [&_nav]:data-toc-id:prose-headings:text-black [&_nav]:data-toc-id:prose-headings:font-extrabold [&_nav]:data-toc-id:prose-headings:m-0 [&_nav]:data-toc-id:prose-p:my-0',
          {
            'border-ue-red': invalid,
          },
        ),
      },
    },
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html: string = editor.getHTML()
      const text: string = html === '<p></p>' ? '' : html
      onChange(text)
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavigation(entry.target.id)
        }
      })
    })
    const elementsNavigation = document.querySelectorAll('[data-toc-id]')
    elementsNavigation.forEach((elementNavigation) => {
      observer.observe(elementNavigation)
    })
    return () => {
      observer.disconnect()
    }
  }, [navigation.length])

  const navigateTo = useCallback(
    (id: string) => () => {
      if (!editor) return
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`)
      if (!element) return
      const pos = editor.view.posAtDOM(element, 0)
      const tr = editor.view.state.tr
      tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
      editor.view.dispatch(tr)
      editor.view.focus()
      element.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
    },
    [editor],
  )

  return (
    <div className='relative flex flex-col items-start gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      {translate ? (
        <span className='bg-anti-flash-white mb-1 rounded-sm px-2 py-1 text-sm leading-4.5'>
          {label}
        </span>
      ) : (
        <label className='text-base leading-4.75 font-bold'>{label}</label>
      )}
      <div
        className={cn('w-full', {
          'border-gray-x11 mb-2 rounded-md border border-dashed':
            navigation.length > 0 && enabledNavigation,
        })}
      >
        {navigation.length > 0 && enabledNavigation && (
          <div className='grid-cols-auto-fill grid gap-2 px-4 py-2'>
            {navigation.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={navigateTo(item.id)}
                  className={cn(
                    'text-dark-charcoal hover:text-dav-ys-grey cursor-pointer transition-colors duration-100 after:invisible after:block after:border-b-2 after:border-b-black after:pt-1 after:content-[""] hover:after:visible',
                    {
                      'text-black after:visible': item.id === activeNavigation,
                    },
                  )}
                >
                  <span className='text-sm leading-4.5 font-medium'>
                    {item.textContent}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      {editor && (
        <BubbleMenu
          className='shadow-deep flex flex-wrap items-center rounded-xl bg-white p-1'
          editor={editor}
        >
          <MenuItem
            icon='Paragraph'
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive('paragraph')}
          />
          <MenuItem
            icon='H2'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive('heading', { level: 2 })}
          />
          <MenuItem
            icon='H3'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive('heading', { level: 3 })}
          />
          <MenuItem
            icon='Bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          />
          <MenuItem
            icon='Italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          />
          <MenuItem
            icon='Strike'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
          />
          <MenuItem
            icon='BulletList'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          />
          <MenuItem
            icon='OrderedList'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          />
          <MenuItem
            icon='Blockquote'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
          />
          <MenuItem
            icon='HorizontalRule'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={editor.isActive('horizontalRule')}
          />
          {enabledNavigation && (
            <>
              <MenuItem
                icon='Navigation'
                onClick={() => editor.chain().focus().setCustomHeading().run()}
                active={editor.isActive('customHeading')}
              />
              {editor.isActive('customHeading') && (
                <MenuItem
                  icon='UnNavigation'
                  onClick={() =>
                    editor.chain().focus().removeCustomHeading().run()
                  }
                />
              )}
            </>
          )}
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu
          className='shadow-deep flex flex-wrap items-center rounded-xl bg-white p-1'
          editor={editor}
        >
          <MenuItem
            icon='Paragraph'
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive('paragraph')}
          />
          <MenuItem
            icon='H2'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive('heading', { level: 2 })}
          />
          <MenuItem
            icon='H3'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive('heading', { level: 3 })}
          />
          <MenuItem
            icon='Bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          />
          <MenuItem
            icon='Italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          />
          <MenuItem
            icon='Strike'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
          />
          <MenuItem
            icon='BulletList'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          />
          <MenuItem
            icon='OrderedList'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          />
          <MenuItem
            icon='Blockquote'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
          />
          <MenuItem
            icon='HorizontalRule'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={editor.isActive('horizontalRule')}
          />
        </FloatingMenu>
      )}
      {editor && (
        <DragHandle
          editor={editor}
          className='hover:bg-dark-charcoal active:bg-dav-ys-grey flex h-6 w-5 cursor-grab items-center justify-center rounded-md bg-black transition-colors'
        >
          <Icons.Drag className='size-4.5 text-white' />
        </DragHandle>
      )}
      <EditorContent editor={editor} className='w-full' />
    </div>
  )
}

type MenuItemProps = {
  active?: boolean
  disabled?: boolean
  icon: keyof typeof Icons
  onClick?: () => void
}

function MenuItem({ onClick, active, disabled, icon }: MenuItemProps) {
  const Icon = Icons[icon]

  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'active:bg-dark-charcoal cursor-pointer rounded-md p-1 text-black hover:bg-black hover:text-white',
        {
          'bg-black text-white': active,
          'bg-chinese-white hover:bg-chinese-white text-gray-x11 hover:text-gray-x11 cursor-default':
            disabled,
        },
      )}
    >
      <Icon className='size-4' />
    </button>
  )
}
