'use client';

import Image from 'next/image';
import styles from './card.module.css';
import Link from 'next/link';
import BlogPostViewer from '@/app/components/blogPostViewer/render';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Card = ({ item, showActions = false, onDelete }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);

  let jsonContent = null;
  let previewText = '';

  if (typeof item.desc === 'string') {
    const jsonStart = item.desc.indexOf('{');
    if (jsonStart !== -1) {
      previewText = item.desc.substring(0, jsonStart).trim();
      const jsonPart = item.desc.substring(jsonStart);
      try {
        const parsed = JSON.parse(jsonPart);
        if (parsed?.type === 'doc') {
          jsonContent = {
            ...parsed,
            content: parsed.content.slice(0, 2),
          };
        }
      } catch (err) {
      }
    } else {
      previewText = item.desc.substring(0, 100);
    }
  }

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/write/${item.slug}`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/posts/${item.slug}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');

      alert('Blog deleted successfully');
      onDelete && onDelete(item.slug);  // Inform parent to update UI
    } catch (err) {
      alert('Error deleting blog');
    }
  };

  return (
    <div className={styles.container}>
      {item.img && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {item.createdAt?.substring(0, 10)} -{' '}
          </span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1>{item.title}</h1>
        </Link>

        <div className={styles.desc}>
          {jsonContent ? (
            <BlogPostViewer content={jsonContent} />
          ) : (
            <p>{previewText}...</p>
          )}
        </div>

        <div className={styles.actionsWrapper}>
          <Link href={`/blogMC/${item.slug}`} className={styles.link}>
            Read More
          </Link>

          {showActions && (
            <div
              className={styles.dotsWrapper}
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <span className={styles.dots}>⋮</span>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Card;
