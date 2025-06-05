'use client';

import BulletList from '@tiptap/extension-bullet-list';
import Paragraph from '@tiptap/extension-paragraph';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Text from '@tiptap/extension-text';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';

interface TiptapProps {
  content?: string
  onChange?: (content: string) => void
}

const Tiptap = ({ content, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit,Text,Underline],
    content: content || '<p>Hello World!</p>',
    onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        onChange?.(html)
    },
  })

  if (!editor) return null;

  return (
    <div className='border-2 border-gray-300 rounded-md'>
        <div className="flex gap-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-300 p-2' : 'p-2'}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-300 p-2' : 'p-2'}
        >
          Italic
        </button>
        <button
         onClick={() => editor.chain().focus().toggleUnderline().run()}
         disabled={!editor.can().chain().focus().toggleUnderline().run()}
         className={editor.isActive('underline') ? 'bg-gray-300 p-2' : 'p-2'}
        >
          Underline
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap"/>
    </div>
  )
}

export default Tiptap