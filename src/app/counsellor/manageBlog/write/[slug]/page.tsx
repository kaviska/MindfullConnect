import TextEditor from "@/app/components/texteditor/textEditor";
import { notFound } from "next/navigation";

async function getBlogPost(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Failed to fetch blog post with slug: ${slug}`);
    return null;
  }

  const post = await res.json();

  return {
    title: post.title,
    description: post.description,
    category: post.category,
    coverImage: post.coverImage || '',
    content: JSON.parse(post.content), // TipTap format
    slug: post.slug,
  };
}

export default async function EditBlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug);

  if (!blog) {
    notFound(); // triggers 404 page
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <TextEditor
        initialTitle={blog.title}
        initialDescription={blog.description}
        initialCategory={blog.category}
        initialImage={blog.coverImage}
        initialContent={blog.content}
        slug={blog.slug}
        isEditing={true}
      />
    </div>
  );
}
