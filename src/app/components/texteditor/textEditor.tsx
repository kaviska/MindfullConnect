'use client';

import { useState, useEffect } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './menuBar';

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
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: 'list-disc ml-3' },
        },
        listItem: {
          HTMLAttributes: { class: 'list-item' },
        },
      }),
      Placeholder.configure({
        placeholder: 'Write the blog content here...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'min-h-[500px] border-2 border-amber-300 rounded-lg p-4',
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
      coverImage: coverImage ? coverImage.name : initialImage || null,
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
    <div className="space-y-4 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Title and Category */}
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
          <option value="" disabled>
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

      {/* Description */}
      <textarea
        placeholder="Post description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
      />

      {/* Cover Image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
      />

      {/* Editor and Publish */}
      <div className="flex items-center justify-between">
        <MenuBar editor={editor} />
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => handlePublish(true)}
            disabled={loading}
            className="bg-amber-400 text-black text-sm px-4 py-2 rounded-md hover:bg-amber-500 hover:text-white disabled:opacity-50 transition"
          >
            {loading ? 'Publishing...' : isEditing ? 'Update' : 'Publish'}
          </button>

          <button
            onClick={() => handlePublish(false)}
            disabled={loading}
            className="bg-gray-400 text-black text-sm px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white  disabled:opacity-50 transition"
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className="bg-white" />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default TextEditor;