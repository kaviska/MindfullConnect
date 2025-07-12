import Image from 'next/image'
import styles from './card.module.css'
import Link from 'next/link'
import BlogPostViewer from '@/app/components/blogPostViewer/render'

const Card = ({ item }: any) => {
  let jsonContent = null
  let previewText = ''

  if (typeof item.desc === 'string') {
    // Try to split at the first JSON block
    const jsonStart = item.desc.indexOf('{')
    if (jsonStart !== -1) {
      previewText = item.desc.substring(0, jsonStart).trim()
      const jsonPart = item.desc.substring(jsonStart)
      try {
        const parsed = JSON.parse(jsonPart)
        if (parsed?.type === 'doc') {
          jsonContent = {
            ...parsed,
            content: parsed.content.slice(0, 2), // Preview first 2 nodes
          }
        }
      } catch (err) {
        // Invalid JSON, ignore
      }
    } else {
      previewText = item.desc.substring(0, 60)
    }
  }

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

        <Link href={`/blogMC/${item.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  )
}

export default Card
