import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/postModel';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const post = await Post.findOne({ slug: params.slug }).populate('author', 'username email');

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('[GET /api/posts/[slug]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

//Delete a blog post
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const { slug } = params;

    const deletedPost = await Post.findOneAndDelete({ slug });

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
    console.error('[DELETE /api/posts/:slug]', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

//Edit a blog post
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const updates = await req.json();

    const updatedPost = await Post.findOneAndUpdate(
      { slug: params.slug },
      updates,
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('[PUT /api/posts/:slug]', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}
