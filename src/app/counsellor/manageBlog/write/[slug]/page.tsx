import TextEditor from "@/app/components/texteditor/textEditor";

async function getBlogPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: "no-store",
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
    coverImage: post.coverImage || "",
    content: JSON.parse(post.content), // ensure it's a TipTap-friendly JSON
    slug: post.slug,
  };
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    return <div className="p-10 text-center text-red-500">Blog not found.</div>;
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
