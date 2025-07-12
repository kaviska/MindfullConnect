import { notFound } from 'next/navigation'
import styles from './page.module.css'
import Image from 'next/image'
import BlogPostViewer from '@/app/components/blogPostViewer/render'

async function getData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`, {
    cache: 'no-store',
  })

  if (!res.ok) return null
  return res.json()
}

const BlogPost = async ({ params }: { params: { slug: string } }) => {
  const post = await getData(params.slug)
  if (!post) notFound()

  const parsedContent = JSON.parse(post.content)

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

export default BlogPost
