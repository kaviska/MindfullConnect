import { NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";
import Post from '@/models/postModel';

export async function GET(req: Request, { params }: { params: { name: string } }) {
  await connect();

  try {
    const posts = await Post.find({ category: params.name });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts by category' }, { status: 500 });
  }
}
