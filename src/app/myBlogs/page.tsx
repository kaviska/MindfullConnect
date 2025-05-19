'use client'

import { useState, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

type Blog = {
  _id: string
  title: string
  slug: string
  image?: string
  createdAt: string
  author: {
    name: string
    email: string
  }
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/posts')
        const data = await res.json()
        setBlogs(data)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      }
    }

    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this blog?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id))
      } else {
        console.error('Failed to delete blog')
      }
    } catch (err) {
      console.error('Error deleting blog:', err)
    }
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-semibold mb-4">My Blogs</h1>

      {blogs.map((blog) => (
        <div key={blog._id} className="w-full bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between px-4 py-3 hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <img
              src={blog.image || '/placeholder.jpg'}
              alt={blog.title}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div>
              <h2 className="text-lg font-medium">{blog.title}</h2>
              <p className="text-sm text-gray-500">Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">By {blog.author.name}</p>
            </div>
          </div>

          <div className="relative">
            <button onClick={() => setMenuOpenId(menuOpenId === blog._id ? null : blog._id)}>
              <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>

            {menuOpenId === blog._id && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => window.location.href = `/blog/${blog.slug}`}
                >
                  View
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
