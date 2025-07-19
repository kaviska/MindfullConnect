import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import BlogPostViewer from "@/app/components/blogPostViewer/render";

async function getData(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    console.log('Fetching post for slug:', decodedSlug);

    // Use absolute URL for production
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    console.log('Base URL:', baseUrl);
    console.log('Full API URL:', `${baseUrl}/api/posts/${decodedSlug}`);

    const response = await fetch(`${baseUrl}/api/posts/${decodedSlug}`, {
      cache: "no-store", // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      console.error('Failed to fetch post:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }

    const post = await response.json();
    console.log('Post fetched successfully:', post?.title || 'No title');
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

const BlogPost = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  console.log('BlogPost component - slug:', slug);
  
  const post = await getData(slug);

  if (!post) {
    console.log('No post found, triggering 404');
    notFound();
  }

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