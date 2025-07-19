import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/postModel';
import { Model } from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const PostModel = Post as Model<any>;
    const post = await PostModel.findOne({ slug: params.slug }).populate('author', 'username email');

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
    console.error('[DELETE /api/posts/:slug]', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

//Edit a blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const body = await req.json();
    const { title, content, description, category, coverImage, published } = body;

    const PostModel = Post as Model<any>;
    const updatedPost = await PostModel.findOneAndUpdate(
      { slug: params.slug },
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