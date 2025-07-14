'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const BlogPostViewer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}

export default BlogPostViewer
