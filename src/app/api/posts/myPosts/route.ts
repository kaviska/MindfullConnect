import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/postModel";
import '@/models/userModel';
import mongoose from "mongoose";
// import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  await dbConnect();
  /*
  const user = await getUserFromToken();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  */

  // TODO: Replace this hardcoded user with the actual logic commented above
  const user = {
    id: '6812f2edcedf32c7425dfccc',
    username: '681bcecb2a399b0e3c35e3d6',
    email: 'jane@gmail.com',
  };

  if (!mongoose.Types.ObjectId.isValid(user.id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const posts = await Post.find({
      author: new mongoose.Types.ObjectId(user.id),
    }).populate('author', 'username email');

    if (!posts.length) {
      return NextResponse.json(
        { message: "No blog posts found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('[GET /api/posts/myPosts] Failed to fetch posts:', error);
    return NextResponse.json(
      { error: "Failed to fetch user's posts" },
      { status: 500 }
    );
  }
}
