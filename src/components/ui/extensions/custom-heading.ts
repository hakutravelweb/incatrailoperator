import { mergeAttributes, Node } from '@tiptap/core'

export interface CustomHeadingOptions {
  HTMLAttributes: object
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customHeading: {
      setCustomHeading: () => ReturnType
      removeCustomHeading: () => ReturnType
    }
  }
}

export const CustomHeading = Node.create<CustomHeadingOptions>({
  name: 'customHeading',
  group: 'block',
  content: 'block+',
  draggable: true,
  parseHTML() {
    return [
      {
        tag: 'nav',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['nav', mergeAttributes(HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setCustomHeading:
        () =>
        ({ chain }) => {
          const id = `heading-${Date.now()}`
          return chain()
            .wrapIn(this.name, {
              id,
              'data-toc-id': id,
            })
            .run()
        },
      removeCustomHeading:
        () =>
        ({ chain }) => {
          return chain().lift(this.name).run()
        },
    }
  },
})
