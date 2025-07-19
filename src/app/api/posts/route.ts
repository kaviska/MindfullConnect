import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/postModel';
import { getUserFromToken } from "@/lib/getUserFromToken";
import { Model } from 'mongoose';


// GET posts either all or by category
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let posts;
    const PostModel = Post as Model<any>;

    if (category) {
      posts = await PostModel.find({ category, published: true });
    } else {
      posts = await PostModel.find({ published: true });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
        console.log('POST /api/posts called');
        await dbConnect();
        
        const body = await req.json();
        console.log('Request body received:', { ...body, content: '[CONTENT_TRUNCATED]' });
        
        // Improved slug generation
        if (!body.slug) {
          const baseSlug = body.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim(); // Remove leading/trailing whitespace
          
          body.slug = `${baseSlug}-${Date.now()}`;
          console.log('Generated slug:', body.slug);
        } else {
          console.log('Using provided slug:', body.slug);
        }
    
        const PostModel = Post as Model<any>;
        console.log('Creating new post with PostModel');
        
        const newPost = new PostModel(body);
        console.log('Post instance created, saving to database');
    
        await newPost.save();
        console.log('Post saved successfully with ID:', newPost._id);
    
        return NextResponse.json({ 
          message: 'Post created successfully', 
          post: newPost,
          slug: newPost.slug 
        }, { status: 201 });
      } catch (error: any) {
        console.error('Create post error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          code: error.code
        });
        
        return NextResponse.json({ 
          error: 'Failed to create post', 
          details: error.message,
          errorType: error.name 
        }, { status: 500 });
      }
}