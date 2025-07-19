'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './cardList.module.css';
import Card from '../card/card';
import { Suspense } from 'react'


const CardList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('cat');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = category ? `/api/posts?category=${category}` : `/api/posts`;
        const response = await fetch(url);
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
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
        {category ? `Posts in "${category}"` : 'Recent Posts'}
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className={styles.posts}>
        {posts.map((post) => (
          <Card
            key={post._id}
            item={{
              img: post.img || '/CoupleTherapy.png',
              title: post.title,
              desc: post.content?.substring(0, 100) || '',
              createdAt: post.createdAt,
              catSlug: post.category || '',
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
