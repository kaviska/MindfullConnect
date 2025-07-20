"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/card/card";

interface BlogPost {
  _id: string;
  img?: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
  slug: string;
  published: boolean;
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await fetch("/api/posts/myPosts");
        const data = await res.json();

        if (!Array.isArray(data)) {
          setError(
            data.message || data.error || "Unexpected response from server."
          );
          setBlogs([]);
        } else {
          setBlogs(data);
        }
      } catch (err) {
        setError("Failed to fetch blogs.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  // New handler to remove deleted blog from UI
  const handleDelete = (slug: string) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.slug !== slug));
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
          Your Blogs
        </h1>

        {loading && (
          <div className="text-center text-gray-500 text-lg">
            Loading your blogs...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg">{error}</div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            You haven’t written any blogs yet. Start sharing your thoughts!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              item={{
                img: blog.img,
                title: blog.title,
                desc: blog.content.slice(0, 100),
                createdAt: blog.createdAt,
                catSlug: blog.category,
                slug: blog.slug,
                _id: blog._id,
                published: blog.published,
              }}
              showActions={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
