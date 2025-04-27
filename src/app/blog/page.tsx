import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import BlogContent from "../components/blogContent";

const allPostsQuery = groq`*[_type == "post"]{...,
  author->,
    categories[]->
} | order(_createdAt desc)`;


export default async function Blog() {
    const posts = await client.fetch(allPostsQuery);

  return (
    <div>
      <BlogContent posts={posts} />
    </div>
  )
}

