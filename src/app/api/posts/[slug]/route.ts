import { NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";
import Post from '@/models/postModel';

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
  ) {
    await connect();
  
    try {
      const post = await Post.findOne({ slug: params.slug }).populate('author', 'name email');
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
  
      return NextResponse.json(post);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
  }