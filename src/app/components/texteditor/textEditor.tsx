'use client'

import { useState, useEffect } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './menuBar'
import styles from './textEditor.module.css'

const TextEditor = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('User is not logged in.')
      // Redirect to login page or handle it based on your logic
    }
    setUserId(userId)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'list-item',
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Write the blog content here...',
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[500px] border-2 border-amber-300 rounded-lg p-4',
      },
    },
  })

  const handlePublish = async () => {
    try {
      if (!editor) return

      if (!category) {
        alert('Please select a category.')
        return
      }

      const postTitle = title.trim() || 'Untitled Post'
      const slug = `${postTitle.toLowerCase().replace(/\s+/g, '-')}-${userId}-${Date.now()}`
      const content = JSON.stringify(editor.getJSON())

      setLoading(true)

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postTitle,
          slug,
          content,
          author: '6813edd499737df9ab64764d',
          category,
          published: true,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.message || 'Failed to publish')
      }

      const data = await res.json()
      console.log('Post published:', data)
      alert('Post published successfully!')
    } catch (error: any) {
      console.error('Error during publish:', error)
      setError(error.message || 'An error occurred')
      alert('Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-4 border border-gray-300 rounded-md px-3 py-2 min-w-[320px]"
          required
        >
          <option value="" disabled className="styles.placeholder">
            Article category...
          </option>
          <option value="wellbeing">Wellbeing</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="self-care">Self-Care</option>
          <option value="relationships">Relationships</option>
          <option value="therapy">Therapy</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <MenuBar editor={editor} />
        <button
          onClick={handlePublish}
          disabled={loading}
          className="bg-amber-400 text-white text-sm px-4 py-2 rounded-md hover:bg-amber-500 disabled:opacity-50 transition"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <EditorContent editor={editor} />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default TextEditor
