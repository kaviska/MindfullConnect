import { groq } from "next-sanity";
import { Post } from "../../../../type";
import { client, urlFor } from "@/sanity/lib/client";
import Container from "@/app/components/blogContainer";
import Image from "next/image";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { RichText } from "@/app/components/RichText";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 30;

export const generateStaticParams = async () => {
  const query = groq`*[_type == 'post']{ slug }`;
  const slugs: Post[] = await client.fetch(query);
  return slugs.map((post) => ({
    params: { slug: post?.slug?.current },
  }));
};

const SlugPage = async ({ params }: Props) => {
  // Wait for the params object to be resolved
  const resolvedParams = await params;
  const slugValue = resolvedParams.slug;
  
  const query = groq`*[_type == 'post' && slug.current == $slug][0]{
    ...,
    body,
    author->
  }`;
  
  const post: Post = await client.fetch(query, { slug: slugValue });

  return (
    <Container className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
      {/* Post Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Main Post Image */}
        <div className="w-full md:w-2/3">
          {post?.mainImage && (
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src={urlFor(post.mainImage).url()}
                width={800}
                height={450}
                alt="main image"
                className="object-cover w-full h-auto transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          )}
        </div>
        
        {/* Author Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          {post?.author?.image && (
            <div className="mb-4 p-1 ring-2 ring-indigo-500 rounded-full">
              <Image
                src={urlFor(post.author.image).url()}
                width={120}
                height={120}
                alt="author image"
                className="w-28 h-28 rounded-full object-cover"
              />
            </div>
          )}
          
          {post?.author?.name && (
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-center">
              {post.author.name}
            </h3>
          )}
          
          {post?.author?.description && (
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm leading-relaxed">
              {post.author.description}
            </p>
          )}
          
          {/* Social Icons */}
          <div className="flex gap-4 justify-center">
            {[FaYoutube, FaGithub, FaFacebookF, FaInstagram, FaLinkedin].map(
              (Icon, idx) => (
                <Link
                  key={idx}
                  href="https://www.youtube.com/channel/UChkOsij0dhgft0GhHRauOAA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all transform hover:-translate-y-1 hover:shadow-md"
                >
                  <Icon size={18} />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Post Title and Meta */}
      {post?.title && (
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">{post.title}</h1>
          {post?._createdAt && (
            <div className="text-gray-500 dark:text-gray-400">
              {new Date(post._createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 mb-12" />
      
      {/* Post Content - Fixed to ensure proper text wrapping and formatting */}
      <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none mx-auto whitespace-normal break-words">
        <PortableText 
          value={post?.body} 
          components={{
            ...RichText,
            block: {
              ...RichText.block,
              normal: ({children}) => <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-300">{children}</p>,
              h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
              h4: ({children}) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-6 text-gray-600 dark:text-gray-400">
                  {children}
                </blockquote>
              ),
            },
          }}
        />
      </article>
      
      {/* Tags Section (if available) */}
      {post?.categories && post.categories.length > 0 && (
        <div className="mt-12">
          <h4 className="text-lg font-semibold text-700 dark:text-300 mb-4">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category: any) => (
              <span 
                key={category._id}
                className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
              >
                {category.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default SlugPage;