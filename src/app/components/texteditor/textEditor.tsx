'use client';

import { useState, useEffect } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './menuBar';
import { FileText, Save, Send } from 'lucide-react';

interface TextEditorProps {
  initialTitle?: string;
  initialDescription?: string;
  initialCategory?: string;
  initialImage?: string;
  initialContent?: any;
  isEditing?: boolean;
  slug?: string;
}

const TextEditor = ({
  initialTitle = '',
  initialDescription = '',
  initialCategory = '',
  initialImage = '',
  initialContent = '',
  isEditing = false,
  slug = '',
}: TextEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: 'list-disc ml-6' },
        },
        listItem: {
          HTMLAttributes: { class: 'list-item' },
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'min-h-[600px] border border-gray-200 rounded-lg p-6 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
      },
    },
  });

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const handlePublish = async (pubStatus: boolean) => {
    if (!editor || !category) return alert('Please fill all fields.');

    const postTitle = title.trim() || 'Untitled Post';
    const content = JSON.stringify(editor.getJSON());

    const body = {
      title: postTitle,
      slug: isEditing
        ? slug
        : `${postTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      content,
      description,
      category,
      published: pubStatus,
      author: '681bcecb2a399b0e3c35e3d6', // TODO: Replace with actual user ID from context or token
    };

    try {
      setLoading(true);
      const response = await fetch(
        isEditing ? `/api/posts/${slug}` : '/api/posts',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save');

      alert(isEditing ? 'Blog updated successfully!' : 'Post published successfully!');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 bg-blue-50 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-4xl font-bold text-gray-900">Create a Blog Post</h1>
        <p className="text-gray-600 mt-1">Write and publish your blog content</p>
      </div>

      {/* Title and Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 lg:w-80 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          >
            <option value="" disabled className="text-gray-500">
              Select a category...
            </option>
            <option value="wellbeing">Wellbeing</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="self-care">Self-Care</option>
            <option value="relationships">Relationships</option>
            <option value="therapy">Therapy</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <textarea
          placeholder="Post description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 min-h-[120px] text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y transition"
        />
      </div>

      {/* Editor and Publish */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <MenuBar editor={editor} />
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => handlePublish(true)}
              disabled={loading}
              className="flex-1 lg:flex-none inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              <Send size={18} />
              {loading ? 'Publishing...' : isEditing ? 'Update' : 'Publish'}
            </button>
            <button
              onClick={() => handlePublish(false)}
              disabled={loading}
              className="flex-1 lg:flex-none inline-flex items-center gap-2 px-6 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>
        <EditorContent editor={editor} className="bg-white rounded-lg shadow-sm" />
      </div>

      {error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TextEditor;