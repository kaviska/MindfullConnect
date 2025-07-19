import { notFound } from 'next/navigation'
import styles from './page.module.css'
import Image from 'next/image'
import BlogPostViewer from '@/app/components/blogPostViewer/render'
import { type Metadata } from 'next'
import type { PageProps } from 'next'

async function getData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`, {
      cache: 'no-store',
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function BlogPost({ params }: PageProps<{ slug: string }>) {
  const post = await getData(params.slug)

  if (!post) return notFound()

  let parsedContent
  try {
    parsedContent = JSON.parse(post.content)
  } catch (err) {
    console.error('Invalid JSON content in post:', err)
    return notFound()
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.meta}>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className={styles.category}>{post.category}</span>
      </div>

      {post.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.content}>
        <BlogPostViewer content={parsedContent} />
      </div>
    </div>
  )
}
