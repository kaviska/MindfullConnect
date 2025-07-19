import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";
import BlogPostViewer from "@/app/components/blogPostViewer/render";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/postModel";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";

async function getData(slug: string) {
  try {
    console.log("Getting data for slug:", slug);

    // Decode the slug in case it's URL encoded
    const decodedSlug = decodeURIComponent(slug);
    console.log("Decoded slug:", decodedSlug);

    // Connect to database directly in server component
    await dbConnect();
    const PostModel = Post as Model<any>;

    // First try to find by slug (most common case)
    let post = await PostModel.findOne({ slug: decodedSlug }).populate(
      "author",
      "username email"
    );

    console.log(
      "Searching by slug:",
      decodedSlug,
      post ? "Found" : "Not found"
    );

    // If not found by slug and it looks like an ObjectId, try that
    if (!post && ObjectId.isValid(decodedSlug)) {
      console.log("Searching by ObjectId:", decodedSlug);
      post = await PostModel.findById(decodedSlug).populate(
        "author",
        "username email"
      );
    }

    if (post) {
      console.log("Post found:", post.title);
      // Convert to plain object to avoid serialization issues
      return JSON.parse(JSON.stringify(post));
    } else {
      console.log("No post found for:", decodedSlug);
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

const BlogPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getData(slug);
  if (!post) notFound();

  // Safely parse content with error handling
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
          content: [{ type: "text", text: "Error loading content" }],
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
