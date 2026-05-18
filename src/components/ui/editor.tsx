'use client'
import { useEffect, useRef, useState } from 'react'
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
import { useOnClickOutside } from '@/hooks/use-onclick-outside'
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
  isFocus?: boolean
  onNavigation?: (value: Navigation[]) => void
}

export function Editor({
  ref,
  label,
  value = '',
  onChange,
  placeholder,
  invalid,
  isFocus,
  onNavigation,
}: Props) {
  const t = useTranslations('Dashboard')
  const link = useDisclosure()
  const focus = useDisclosure()
  const contentRef = useRef<HTMLDivElement>(null)
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
          'before:text-pewter-metallic before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none',
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
        class:
          'min-h-40 outline-hidden [&_:is(h3,strong)]:text-abstract-navy [&_a]:font-medium [&_hr]:border-t-faded-white [&_ul_li,&_ol_li]:marker:text-abstract-navy text-base leading-5.5 [&_:is(h3)]:mb-2 [&_a]:underline-premium [&_h3]:text-xl [&_h3]:leading-6 [&_h3]:font-bold [&_hr]:my-4 [&_ol]:list-decimal [&_p:not(:last-child)]:mb-4 [&_:is(h3,strong)]:font-medium [&_ul]:list-disc [&_ul_li,&_ol_li]:ml-4 [&_ul:not(:last-child),&_ol:not(:last-child)]:mb-4 [&_nav]:bg-bright-grey [&_nav]:px-4 [&_nav]:py-2 [&_nav]:mb-2 [&_nav_:is(h3)]:mb-0 [&_nav]:rounded-full',
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

  useEffect(() => {
    if (focus.isOpen || isFocus) {
      editor?.commands.focus()
    }
  }, [focus.isOpen, isFocus])

  useOnClickOutside({
    ref: contentRef,
    handler: focus.onClose,
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
    <div
      ref={contentRef}
      onClick={focus.onOpen}
      className={cn(
        'border-pewter-metallic relative flex cursor-text items-center gap-2 rounded-lg border-2 bg-white p-3',
        {
          'border-blue-fire': focus.isOpen,
          'border-cayenne-red': invalid,
          'rounded-none border-none p-0': !label,
        },
      )}
    >
      <input ref={ref} readOnly className='absolute size-px outline-none' />
      <div className='flex flex-1 flex-col'>
        {label && (
          <label
            className={cn('text-nevada pointer-events-none text-xs leading-4', {
              'text-blue-fire': focus.isOpen,
              'text-cayenne-red': invalid,
            })}
          >
            {label}
          </label>
        )}
        <div
          className={cn('w-full', {
            'mb-2': navigation.length > 0 && onNavigation,
          })}
        >
          {navigation.length > 0 && onNavigation && (
            <div className='flex flex-wrap gap-2 py-1'>
              {navigation.map((item) => {
                return (
                  <span
                    key={item.id}
                    className='bg-bright-grey rounded-full px-4 py-2 text-base leading-5'
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
            className='shadow-main border-faded-white flex flex-wrap items-center rounded-2xl border bg-white p-2'
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
            className='shadow-main border-faded-white flex flex-wrap items-center rounded-2xl border bg-white p-2'
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
            className='hover:bg-camouflage-blue bg-abstract-navy flex h-6 w-5 cursor-grab items-center justify-center rounded-md transition-colors duration-200'
          >
            <Icons.Drag className='size-4.5 text-white' />
          </DragHandle>
        )}
        <EditorContent editor={editor} className='w-full' />
      </div>
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
        'not-disabled:hover:bg-faded-white not-disabled:text-abstract-navy disabled:text-pewter-metallic cursor-pointer rounded-md p-1 transition-colors duration-200 disabled:cursor-not-allowed',
        {
          'not-disabled:bg-bright-grey': active,
        },
      )}
    >
      <Icon className='size-4' />
    </button>
  )
}
