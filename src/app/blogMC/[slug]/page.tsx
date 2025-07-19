import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import BlogPostViewer from "@/app/components/blogPostViewer/render";

async function getData(slug: string) {
  try {
    console.log("getData called with slug:", slug);

    // Fix the baseUrl logic
    let baseUrl = "http://localhost:3000"; // Default for development

    if (process.env.NEXT_PUBLIC_API_URL) {
      baseUrl = process.env.NEXT_PUBLIC_API_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }

    console.log("Using baseUrl:", baseUrl);
    const fullUrl = `${baseUrl}/api/posts/${slug}`;
    console.log("Fetching from URL:", fullUrl);

    const res = await fetch(fullUrl, {
      cache: "no-store",
    });

    console.log("Fetch response status:", res.status);
    console.log("Fetch response ok:", res.ok);

    if (!res.ok) {
      console.error("Fetch failed with status:", res.status);
      const errorText = await res.text();
      console.error("Error response:", errorText);
      return null;
    }

    const data = await res.json();
    console.log("Successfully fetched post data");
    return data;
  } catch (error) {
    console.error("getData error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return null;
  }
}

const BlogPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
  try {
    console.log("BlogPost component called");

    const { slug } = await params;
    console.log("Resolved slug from params:", slug);

    const post = await getData(slug);
    console.log(
      "getData returned:",
      post ? "Post data received" : "No post data"
    );

    if (!post) {
      console.error("Post not found, calling notFound()");
      notFound();
    }

    console.log("Attempting to parse post content");
    const parsedContent = JSON.parse(post.content);
    console.log("Content parsed successfully");

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
    );
  } catch (error) {
    console.error("BlogPost component error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return (
      <div className="p-4 text-red-500">
        <h1>Error Loading Blog Post</h1>
        <p>An error occurred while loading the blog post.</p>
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
          {error instanceof Error ? error.message : "Unknown error"}
        </pre>
      </div>
    );
  }
};

export default BlogPost;
