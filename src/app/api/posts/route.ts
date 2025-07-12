import { NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";

import '@/models/userModel';
import Post from '@/models/postModel';

// GET posts either all or by category
export async function GET(request: Request) {
  await connect();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    let posts;

    if (category) {
      posts = await Post.find({ category });
    } else {
      posts = await Post.find({});
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Error:", error);
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