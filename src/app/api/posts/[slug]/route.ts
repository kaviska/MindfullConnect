import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/postModel';
import { Model } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log('GET request received for slug:', params.slug);
  console.log('Full request URL:', request.url);
  
  try {
    await dbConnect();
    console.log('Database connected successfully');

    // Decode the slug in case it's URL encoded
    const decodedSlug = decodeURIComponent(params.slug);
    console.log('Decoded slug:', decodedSlug);
    
    const PostModel = Post as Model<any>;
    console.log('Searching for post with slug:', decodedSlug);
    
    const post = await PostModel.findOne({ slug: decodedSlug }).populate('author', 'username email');
    console.log('Database query result:', post ? 'Post found' : 'Post not found');

    if (!post) {
      console.log('Post not found for slug:', decodedSlug);
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    console.log('Returning post successfully:', post.title);
    return NextResponse.json(post);
  } catch (error) {
    console.error('[GET /api/posts/[slug]] Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log('DELETE request received for slug:', params.slug);
  
  try {
    await dbConnect();
    
    const decodedSlug = decodeURIComponent(params.slug);
    console.log('Attempting to delete post with slug:', decodedSlug);
    
    const PostModel = Post as Model<any>;
    const deletedPost = await PostModel.findOneAndDelete({ slug: decodedSlug });

    if (!deletedPost) {
      console.log('Post not found for deletion:', decodedSlug);
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    console.log('Post deleted successfully:', deletedPost.title);
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

// Edit a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log('PUT request received for slug:', params.slug);
  
  try {
    await dbConnect();
    
    const decodedSlug = decodeURIComponent(params.slug);
    console.log('Attempting to update post with slug:', decodedSlug);
    
    const body = await request.json();
    const { title, content, description, category, coverImage, published } = body;
    
    console.log('Update data received:', { title, category, published });

    const PostModel = Post as Model<any>;
    const updatedPost = await PostModel.findOneAndUpdate(
      { slug: decodedSlug },
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
    ).populate('author', 'username email');

    if (!updatedPost) {
      console.log('Post not found for update:', decodedSlug);
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('Post updated successfully:', updatedPost.title);
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