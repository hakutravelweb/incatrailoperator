import { mergeAttributes, Node } from '@tiptap/core'

export interface NavigatorOptions {
  HTMLAttributes: object
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    navigator: {
      toggleNavigator: () => ReturnType
    }
  }
}

export const Navigator = Node.create<NavigatorOptions>({
  name: 'navigator',
  group: 'block',
  content: 'block+',
  draggable: false,
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
      toggleNavigator:
        () =>
        ({ editor, chain }) => {
          if (editor.isActive('navigator')) {
            return chain().lift(this.name).run()
          }
          const id = `navigator-${Date.now()}`
          return chain()
            .wrapIn(this.name, {
              id,
              'data-toc-id': id,
            })
            .run()
        },
    }
  },
})
