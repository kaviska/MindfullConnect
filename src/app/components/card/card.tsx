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
      previewText = item.desc.substring(0, 2000);
    }
  }

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/counsellor/manageBlog/write/${item.slug}`);
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
    <article className={styles.container}>
      <div className={styles.cardWrapper}>
        {item.img && (
          <div className={styles.imageContainer}>
            <Image src={item.img} alt={item.title || "Blog post image"} fill className={styles.image} />
          </div>
        )}
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <div className={styles.metaInfo}>
              <div className={styles.dateWrapper}>
                <svg className={styles.icon} width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={styles.date}>
                  {new Date(item.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className={styles.categoryWrapper}>
                <span className={styles.category}>{item.catSlug}</span>
              </div>
            </div>
            
            {showActions && (
              <div
                className={styles.actionsMenu}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button className={styles.menuButton} aria-label="Post actions">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    <circle cx="12" cy="5" r="1" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1" fill="currentColor"/>
                  </svg>
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <button onClick={handleEdit} className={styles.dropdownItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit Post
                    </button>
                    <button onClick={handleDelete} className={styles.dropdownItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.content}>
            <Link href={`/posts/${item.slug}`} className={styles.titleLink}>
              <h2 className={styles.title}>{item.title}</h2>
            </Link>

            <div className={styles.excerpt}>
              {jsonContent ? (
                <BlogPostViewer content={jsonContent} />
              ) : (
                <p>{previewText}...</p>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <Link href={`/blogMC/${item.slug}`} className={styles.readMore}>
              <span className={styles.readMoreText}>Continue Reading</span>
              <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
