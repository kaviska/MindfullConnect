"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./cardList.module.css";
import Card from "../card/card";
import { Suspense } from "react";

const CardList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("cat");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = category
          ? `/api/posts?category=${encodeURIComponent(category)}`
          : `/api/posts`;
        console.log("Fetching posts with URL:", url);
        console.log("Category parameter:", category);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched posts:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(); // Fetch posts when the component mounts or category changes
  }, [category]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {category ? `Posts in "${category}"` : "All Blog Posts"}
        </h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className={styles.posts}>
          {posts.map((post) => (
            <Card
              key={post._id}
              item={{
                img: post.img,
                title: post.title,
                desc: post.content?.substring(0, 100) || "",
                createdAt: post.createdAt,
                catSlug: post.category || "",
                slug: post.slug,
              }}
            />
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default CardList;
