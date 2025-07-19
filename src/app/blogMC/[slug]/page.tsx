import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import BlogPostViewer from "@/app/components/blogPostViewer/render";

async function getData(slug: string) {
  try {
    // Decode the slug in case it's URL encoded
    const decodedSlug = decodeURIComponent(slug);

    // Determine base URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        baseUrl = "http://localhost:3000";
      }
    }

    const response = await fetch(`${baseUrl}/api/posts/${decodedSlug}`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) return null;

    const post = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

const BlogPost = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const post = await getData(slug);

  if (!post) notFound();

  let parsedContent;
  try {
    parsedContent =
      typeof post.content === "string"
        ? JSON.parse(post.content)
        : post.content;
  } catch (error) {
    console.error("Error parsing post content:", error);
    parsedContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Error loading content." }],
        },
      ],
    };
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title || "Untitled"}</h1>
      <div className={styles.meta}>
        <span>
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "No date"}
        </span>
        <span className={styles.category}>
          {post.category || "Uncategorized"}
        </span>
      </div>
      {post.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={post.image}
            alt={post.title || "Blog post image"}
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
  );
};

export default BlogPost;
