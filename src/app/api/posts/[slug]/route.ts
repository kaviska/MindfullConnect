import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/postModel';
import { Model } from 'mongoose';

function getSlugFromUrl(request: NextRequest): string | null {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    console.log('URL segments:', segments);
    
    // Extract slug from /api/posts/[slug] pattern
    const postsIndex = segments.findIndex(segment => segment === 'posts');
    const encodedSlug = segments[postsIndex + 1];
    
    console.log('Found encoded slug:', encodedSlug);
    
    if (!encodedSlug) return null;
    
    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(encodedSlug);
    console.log('Decoded slug:', decodedSlug);
    
    return decodedSlug;
  } catch (error) {
    console.error('Error parsing slug from URL:', error);
    console.error('Request URL:', request.url);
    return null;
  }
}

export async function GET(request: NextRequest) {
  console.log('GET request received for URL:', request.url);
  
  await dbConnect();

  try {
    const slug = getSlugFromUrl(request);
    console.log('Extracted slug for GET:', slug);
    
    if (!slug) {
      console.error('No slug parameter found in request');
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const PostModel = Post as Model<any>;
    console.log('Searching for post with slug:', slug);
    
    const post = await PostModel.findOne({ slug }).populate('author', 'username email');
    console.log('Database query result:', post ? 'Post found' : 'Post not found');

    if (!post) {
      console.log('Post not found for slug:', slug);
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    console.log('Returning post successfully');
    return NextResponse.json(post);
  } catch (error) {
    console.error('[GET /api/posts/[slug]] Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

//Delete a blog post
export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const slug = getSlugFromUrl(request);
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const PostModel = Post as Model<any>;
    const deletedPost = await PostModel.findOneAndDelete({ slug });

    if (!deletedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[DELETE /api/posts/[slug]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

//Edit a blog post
export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const slug = getSlugFromUrl(request);
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, description, category, coverImage, published } = body;

    const PostModel = Post as Model<any>;
    const updatedPost = await PostModel.findOneAndUpdate(
      { slug },
      {
        $set: {
          title,
          content,
          description,
          category,
          coverImage,
          published,
          updatedAt: new Date(),
        },
      },
      { new: true } // return updated document
    );

    if (!updatedPost) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('[PUT /api/posts/[slug]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}