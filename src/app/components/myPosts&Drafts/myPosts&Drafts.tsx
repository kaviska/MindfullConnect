"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const MyPostsDrafts = () => {
  const { user, isLoading } = useAuth();
  const userId = user?._id;

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
        console.log("Fetched posts:", data);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  if (isLoading) return <p>Loading user...</p>;
  if (!userId) return <p>User not logged in.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Draft Posts</h2>
      {error && <p className="text-red-500">{error}</p>}
      {posts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post: any) => (
            <li key={post._id} className="p-3 border rounded bg-gray-50">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPostsDrafts;
