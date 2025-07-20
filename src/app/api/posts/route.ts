import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/postModel';
import { Model } from 'mongoose';


// GET posts either all or by category
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    console.log('API: Received category parameter:', category);
    
    let posts;
    const PostModel = Post as Model<any>;

    if (category) {
      // Ensure category matching is exact
      posts = await PostModel.find({ 
        category: category.trim(), 
        published: true 
      }).sort({ createdAt: -1 });
      console.log(`API: Found ${posts.length} posts for category: ${category}`);
    } else {
      posts = await PostModel.find({ published: true }).sort({ createdAt: -1 });
      console.log(`API: Found ${posts.length} total published posts`);
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
        
        // Enhanced slug generation
        if (!body.slug) {
          const baseSlug = body.title
            .toLowerCase()
            .trim()                                    // Remove leading/trailing whitespace
            .normalize('NFD')                          // Normalize Unicode characters
            .replace(/[\u0300-\u036f]/g, '')          // Remove diacritics/accents
            .replace(/[''""]/g, '')                   // Remove smart quotes
            .replace(/[,.:'";!?()[\]{}@#$%^&*+=<>]/g, '-')  // Replace punctuation with hyphens
            .replace(/[^\w\s-]/g, '')                 // Remove remaining special characters except hyphens and spaces
            .replace(/\s+/g, '-')                     // Replace spaces with hyphens
            .replace(/-+/g, '-')                      // Replace multiple consecutive hyphens with single hyphen
            .replace(/^-+|-+$/g, '');                 // Remove leading/trailing hyphens
          
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