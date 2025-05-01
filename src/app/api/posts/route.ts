import { NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";
import Post from '@/models/postModel';

export async function GET() {
    await connect();
  
    try {
      const posts = await Post.find({}).populate('author', 'name email');
      return NextResponse.json(posts);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
  }

export async function POST(req: Request) {
    try {
        await connect();
        
        const body = await req.json();
        
        // Optionally, generate the slug if it's not passed
        if (!body.slug) {
          body.slug = body.title.toLowerCase().replace(/ /g, '-') + '-' + new Date().getTime();
        }
    
        const newPost = new Post(body);
    
        await newPost.save();
    
        return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });
      } catch (error: any) {
        console.error('Create post error:', error);  // More detailed error logging
        return NextResponse.json({ error: 'Failed to create post', details: error.message }, { status: 500 });
      }
}
