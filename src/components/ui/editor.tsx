'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm, Controller, RefCallBack } from 'react-hook-form'
import Link from '@tiptap/extension-link'
import {
  getHierarchicalIndexes,
  TableOfContentData,
  TableOfContents,
} from '@tiptap/extension-table-of-contents'
import DragHandle from '@tiptap/extension-drag-handle-react'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { Icons } from '@/icons/icon'
import { cn } from '@/lib/utils'
import { Navigation } from '@/shared/interfaces'
import { LinkSchema, linkResolver, linkDefaultValues } from '@/schemas/article'
import { useDisclosure } from '@/hooks/use-disclosure'
import { Navigator } from './extensions/navigator'
import { Modal } from './modal'
import { Input } from './input'
import { Button } from './button'

interface Props {
  ref?: RefCallBack
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  onNavigation?: (value: Navigation[]) => void
}

export function Editor({
  ref,
  label,
  value = '',
  onChange,
  placeholder,
  invalid,
  onNavigation,
}: Props) {
  const t = useTranslations('Dashboard')
  const link = useDisclosure()
  const [navigation, setNavigation] = useState<TableOfContentData>([])

  const form = useForm<LinkSchema>({
    mode: 'onChange',
    resolver: linkResolver,
    defaultValues: linkDefaultValues,
  })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        blockquote: false,
        heading: {
          levels: [3],
        },
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:text-sonic-silver before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none',
      }),
      Navigator,
      TableOfContents.configure({
        anchorTypes: ['navigator'],
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setNavigation(content)
          if (onNavigation) {
            const navigation: Navigation[] = content.map((navigation) => ({
              id: navigation.id,
              title: navigation.textContent,
            }))
            onNavigation(navigation)
          }
        },
      }),
      Link.configure({
        openOnClick: false,
        enableClickSelection: true,
      }),
      TextStyle,
    ],
    editorProps: {
      attributes: {
        class: cn(
          'min-h-39 border-chinese-white border-2 focus:border-black rounded-sm outline-hidden p-4 text-trout [&_:is(h3,strong)]:text-black [&_a]:text-inferno [&_hr]:border-t-chinese-white [&_ul_li,&_ol_li]:marker:text-inferno text-base leading-6 [&_:is(h3)]:mb-3 [&_a]:underline [&_h3]:text-xl [&_h3]:leading-5 [&_hr]:my-4 [&_ol]:list-decimal [&_p:not(:last-child)]:mb-4 [&_:is(h3,strong)]:font-medium [&_ul]:list-disc [&_ul_li,&_ol_li]:ml-6 [&_ul_li:not(:first-child),&_ol_li:not(:first-child)]:mt-2 [&_ul:not(:last-child),&_ol:not(:last-child)]:mb-4 [&_nav]:bg-inferno/20 [&_nav]:px-2 [&_nav]:py-1 [&_nav]:mb-2 [&_nav_:is(h3)]:mb-0 [&_nav]:rounded-lg',
          {
            'border-ue-red': invalid,
          },
        ),
      },
    },
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const cleaned = html
        .replace(/<br class="ProseMirror-trailingBreak">/g, '')
        .replace(/<p>\s*<\/p>$/g, '')
      onChange(cleaned)
    },
  })
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isParagraph: ctx.editor?.isActive('paragraph'),
        isH3: ctx.editor?.isActive('heading', { level: 3 }),
        isBold: ctx.editor?.isActive('bold'),
        isItalic: ctx.editor?.isActive('italic'),
        isBulletList: ctx.editor?.isActive('bulletList'),
        isOrderedList: ctx.editor?.isActive('orderedList'),
        isHorizontalRule: ctx.editor?.isActive('horizontalRule'),
        isLink: ctx.editor?.isActive('link'),
        isNavigator: ctx.editor?.isActive('navigator'),
      }
    },
  })

  const handleLink = () => {
    const url = editor?.getAttributes('link').href
    form.reset({ url })
    link.onOpen()
  }

  const handleSaveLink = (data: LinkSchema) => {
    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: data.url })
      .run()
    form.reset(linkDefaultValues)
    link.onClose()
  }

  return (
    <div className='relative flex flex-col items-start gap-px'>
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      {label && (
        <label className='text-base leading-5.25 font-medium'>{label}</label>
      )}
      <div
        className={cn('w-full', {
          'border-gray-x11 mb-2 rounded-md border border-dashed':
            navigation.length > 0 && onNavigation,
        })}
      >
        {navigation.length > 0 && onNavigation && (
          <div className='grid-cols-auto-fill grid gap-2 px-4 py-2'>
            {navigation.map((item) => {
              return (
                <span
                  key={item.id}
                  className='text-dark-charcoal text-sm leading-4.5 font-medium'
                >
                  {item.textContent}
                </span>
              )
            })}
          </div>
        )}
      </div>
      <Modal isOpen={link.isOpen} onClose={link.onClose}>
        <div className='flex flex-col gap-4'>
          <Controller
            control={form.control}
            name='url'
            render={({ field, fieldState }) => (
              <Input
                ref={field.ref}
                label={t('editor.link')}
                value={field.value}
                onChange={field.onChange}
                placeholder='https://'
                invalid={fieldState.invalid}
              />
            )}
          />
          <Button
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(handleSaveLink)}
          >
            {t('editor.save-label')}
          </Button>
        </div>
      </Modal>
      {editor && (
        <BubbleMenu
          className='shadow-deep flex flex-wrap items-center rounded-xl bg-white p-1'
          editor={editor}
        >
          <MenuItem
            icon='Paragraph'
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editorState?.isParagraph}
          />
          <MenuItem
            icon='H3'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editorState?.isH3}
          />
          <MenuItem
            icon='Bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editorState?.isBold}
          />
          <MenuItem
            icon='Italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editorState?.isItalic}
          />
          <MenuItem
            icon='Link'
            onClick={handleLink}
            active={editorState?.isLink}
          />
          {editorState?.isLink && (
            <MenuItem
              icon='Unsetlink'
              onClick={() => editor.chain().focus().unsetLink().run()}
            />
          )}
          <MenuItem
            icon='BulletList'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editorState?.isBulletList}
          />
          <MenuItem
            icon='OrderedList'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editorState?.isOrderedList}
          />
          <MenuItem
            icon='HorizontalRule'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={editorState?.isHorizontalRule}
          />
          {onNavigation && (
            <MenuItem
              icon='Navigation'
              onClick={() => editor.chain().focus().toggleNavigator().run()}
              active={editorState?.isNavigator}
            />
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
            active={editorState?.isParagraph}
          />
          <MenuItem
            icon='H3'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editorState?.isH3}
          />
          <MenuItem
            icon='Bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editorState?.isBold}
          />
          <MenuItem
            icon='Italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editorState?.isItalic}
          />
          <MenuItem
            icon='BulletList'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editorState?.isBulletList}
          />
          <MenuItem
            icon='OrderedList'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editorState?.isOrderedList}
          />
          <MenuItem
            icon='HorizontalRule'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={editorState?.isHorizontalRule}
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
